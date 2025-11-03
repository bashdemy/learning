# Feature Flags System Design

## Problem Statement

Design a feature flags system that allows teams to enable/disable features for different users, segments, or environments without deploying new code. The system should support:

- Toggle features on/off in real-time
- Target specific user segments (percentage rollouts, A/B testing)
- Manage feature flags across multiple environments (dev, staging, production)
- Handle high traffic with low latency
- Provide audit logs and versioning

## Requirements

### Functional Requirements
- Create, update, and delete feature flags
- Enable/disable flags for specific users, segments, or percentages
- Support multiple environments (dev, staging, production)
- Real-time flag evaluation with minimal latency
- Admin dashboard for managing flags
- Audit logging for all flag changes

### Non-Functional Requirements
- **Scalability**: Support millions of requests per second
- **Latency**: < 10ms p99 for flag evaluation
- **Availability**: 99.99% uptime
- **Consistency**: Eventually consistent across all servers
- **Durability**: All flag changes must be persisted

## System Architecture

### High-Level Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Client    │────▶│  API Gateway │────▶│  Flag API   │
│ Application │     │              │     │   Service   │
└─────────────┘     └──────────────┘     └─────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │  Flag Cache     │
                                    │  (Redis/CDN)    │
                                    └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │  Flag Database  │
                                    │   (PostgreSQL)  │
                                    └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │  Admin Service  │
                                    │  (Dashboard)    │
                                    └─────────────────┘
```

## Components

### 1. Flag API Service
**Purpose**: Core service that evaluates feature flags for client applications.

**Responsibilities**:
- Evaluate flag rules for given user context
- Return flag status (enabled/disabled)
- Handle flag overrides and targeting rules
- Serve cached flag data

**Key Operations**:
- `GET /api/v1/flags/{flagKey}?userId={userId}&environment={env}`
- `POST /api/v1/flags/batch` (evaluate multiple flags at once)

### 2. Admin Service
**Purpose**: Backend service for managing feature flags via admin dashboard.

**Responsibilities**:
- CRUD operations for feature flags
- Manage targeting rules and segments
- Handle flag versioning and rollbacks
- Audit logging

**Key Operations**:
- `POST /admin/flags` - Create flag
- `PUT /admin/flags/{flagKey}` - Update flag
- `DELETE /admin/flags/{flagKey}` - Delete flag
- `GET /admin/flags` - List all flags
- `GET /admin/flags/{flagKey}/history` - Get flag history

### 3. Flag Database
**Technology**: PostgreSQL (primary), MongoDB (alternative for flexible schema)

**Schema Design**:
```sql
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY,
    flag_key VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT FALSE,
    environment VARCHAR(50) NOT NULL,
    targeting_rules JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    version INTEGER DEFAULT 1
);

CREATE TABLE flag_segments (
    id UUID PRIMARY KEY,
    flag_id UUID REFERENCES feature_flags(id),
    segment_key VARCHAR(255) NOT NULL,
    conditions JSONB,
    enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE flag_overrides (
    id UUID PRIMARY KEY,
    flag_id UUID REFERENCES feature_flags(id),
    user_id VARCHAR(255),
    enabled BOOLEAN NOT NULL,
    expires_at TIMESTAMP
);

CREATE TABLE flag_audit_log (
    id UUID PRIMARY KEY,
    flag_key VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL,
    changed_by VARCHAR(255),
    old_value JSONB,
    new_value JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_flag_key_env ON feature_flags(flag_key, environment);
CREATE INDEX idx_flag_overrides ON flag_overrides(flag_id, user_id);
```

### 4. Cache Layer
**Technology**: Redis (in-memory cache) + CDN (edge caching)

**Caching Strategy**:
- **L1 Cache (CDN)**: Static flag configurations, TTL: 5-10 minutes
- **L2 Cache (Redis)**: Frequently accessed flags, TTL: 1-5 minutes
- **Cache Invalidation**: Pub/Sub notifications when flags are updated

**Cache Key Format**:
```
flag:{flagKey}:{environment}
flag:user:{userId}:{flagKey}:{environment}
```

### 5. Configuration Service
**Purpose**: Distribute flag configurations to edge servers and CDN.

**Responsibilities**:
- Push flag updates to cache layers
- Manage cache invalidation
- Distribute configurations via CDN

## Data Models

### Feature Flag
```json
{
  "flagKey": "new-checkout-flow",
  "description": "Enable new checkout experience",
  "enabled": true,
  "environment": "production",
  "targetingRules": {
    "percentage": 25,
    "segments": ["beta-users", "premium-users"],
    "userIds": ["user123", "user456"],
    "countries": ["US", "CA"],
    "excludedUserIds": []
  },
  "defaultValue": false,
  "version": 3,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-20T14:30:00Z"
}
```

### Flag Evaluation Request
```json
{
  "flagKey": "new-checkout-flow",
  "userId": "user123",
  "environment": "production",
  "context": {
    "country": "US",
    "userSegment": "premium-users",
    "deviceType": "mobile"
  }
}
```

### Flag Evaluation Response
```json
{
  "flagKey": "new-checkout-flow",
  "enabled": true,
  "reason": "user-in-segment",
  "value": {
    "checkoutFlow": "v2",
    "features": ["express-checkout", "apple-pay"]
  }
}
```

## API Design

### Public API (Client-facing)

#### Evaluate Single Flag
```http
GET /api/v1/flags/{flagKey}?userId={userId}&environment={env}
```

**Response**:
```json
{
  "flagKey": "new-checkout-flow",
  "enabled": true,
  "value": {}
}
```

#### Batch Evaluation
```http
POST /api/v1/flags/batch
Content-Type: application/json

{
  "userId": "user123",
  "environment": "production",
  "flagKeys": ["flag1", "flag2", "flag3"],
  "context": {
    "country": "US",
    "userSegment": "premium"
  }
}
```

**Response**:
```json
{
  "flags": [
    {"flagKey": "flag1", "enabled": true},
    {"flagKey": "flag2", "enabled": false},
    {"flagKey": "flag3", "enabled": true}
  ]
}
```

### Admin API

#### Create Flag
```http
POST /admin/flags
Authorization: Bearer {token}
Content-Type: application/json

{
  "flagKey": "new-feature",
  "description": "Feature description",
  "environment": "production",
  "targetingRules": {...}
}
```

#### Update Flag
```http
PUT /admin/flags/{flagKey}
Authorization: Bearer {token}
Content-Type: application/json

{
  "enabled": true,
  "targetingRules": {...}
}
```

## Flag Evaluation Logic

### Priority Order (Highest to Lowest)
1. **User Override**: Explicit enable/disable for specific user
2. **Segment Match**: User matches targeting segment
3. **Percentage Rollout**: User falls within percentage range
4. **Default Value**: Flag's default enabled/disabled state

### Evaluation Algorithm
```python
def evaluate_flag(flag, userId, context):
    # Check user override first
    if has_user_override(flag, userId):
        return override_value
    
    # Check segment targeting
    if matches_segment(flag, context):
        return flag.enabled
    
    # Check percentage rollout
    if in_percentage_range(flag, userId):
        return flag.enabled
    
    # Return default
    return flag.defaultValue
```

## Scalability Considerations

### Horizontal Scaling
- **Stateless API Services**: All API services are stateless, can scale horizontally
- **Load Balancing**: Round-robin or consistent hashing for request distribution
- **Database Sharding**: Shard by environment or flag key prefix

### Caching Strategy
- **Multi-layer Caching**: CDN → Redis → Database
- **Cache Warming**: Pre-populate cache with frequently accessed flags
- **Read Replicas**: Use database read replicas for flag reads

### Performance Optimizations
- **Batch Evaluation**: Evaluate multiple flags in single request
- **Edge Computing**: Cache flags at CDN edge locations
- **Connection Pooling**: Reuse database connections
- **Async Processing**: Use async/await for non-blocking I/O

## Data Flow

### Read Path (Flag Evaluation)
1. Client requests flag evaluation
2. Check CDN cache → if hit, return immediately
3. Check Redis cache → if hit, return immediately
4. Query database (with read replica)
5. Evaluate targeting rules
6. Cache result in Redis and CDN
7. Return to client

### Write Path (Flag Update)
1. Admin updates flag via Admin API
2. Validate and persist to database (primary)
3. Publish change event to message queue
4. Cache invalidation service receives event
5. Invalidate cache in Redis and CDN
6. Update read replicas (async)
7. Return success to admin

## Reliability & Consistency

### Eventual Consistency
- Flag updates propagate to all servers within 1-5 seconds
- Use message queue (Kafka/RabbitMQ) for cache invalidation
- Clients may see stale flags briefly (acceptable for feature flags)

### High Availability
- **Database Replication**: Primary + multiple read replicas
- **Cache Redundancy**: Redis cluster with replication
- **Circuit Breakers**: Fail gracefully if cache is down
- **Fallback Strategy**: Return default values if service unavailable

## Security Considerations

### Authentication & Authorization
- Admin API requires authentication (JWT tokens)
- Role-based access control (RBAC)
- Audit all admin actions

### Data Protection
- Encrypt sensitive flag data at rest
- Use HTTPS for all API communications
- Rate limiting to prevent abuse

### Input Validation
- Validate flag keys (alphanumeric, hyphens, underscores)
- Sanitize user inputs
- Prevent SQL injection and XSS attacks

## Monitoring & Observability

### Key Metrics
- **Latency**: p50, p95, p99 for flag evaluation
- **Throughput**: Requests per second
- **Error Rate**: Failed evaluations
- **Cache Hit Rate**: CDN and Redis hit rates
- **Flag Usage**: Most frequently evaluated flags

### Logging
- Log all flag evaluations (sampled in production)
- Log all admin actions with full audit trail
- Structured logging (JSON format)

### Alerting
- Alert on high latency (> 50ms p99)
- Alert on high error rate (> 1%)
- Alert on cache miss rate spike
- Alert on database connection issues

## Deployment Strategy

### Canary Deployment
- Deploy new flag service version to small percentage of traffic
- Monitor metrics and errors
- Gradually increase traffic to new version

### Blue-Green Deployment
- Deploy new version alongside current version
- Switch traffic when new version is validated
- Rollback instantly if issues detected

## Trade-offs & Considerations

### Consistency vs Availability
- **Choice**: Prioritize availability (eventual consistency)
- **Reason**: Feature flags can tolerate brief inconsistency
- **Impact**: Users may see different flags for 1-5 seconds

### Cache vs Freshness
- **Choice**: Aggressive caching (1-5 min TTL)
- **Reason**: Performance is critical for high-traffic systems
- **Impact**: Flag changes take 1-5 minutes to propagate

### Latency vs Accuracy
- **Choice**: Optimize for latency (< 10ms p99)
- **Reason**: Flags are evaluated frequently in request path
- **Impact**: Use caching and simplified evaluation logic

## Future Enhancements

1. **A/B Testing**: Built-in experimentation framework
2. **Flag Analytics**: Track flag usage and impact
3. **Multi-variate Flags**: Support different flag values (not just on/off)
4. **Flag Dependencies**: Support flags that depend on other flags
5. **Real-time Updates**: WebSocket support for instant flag updates
6. **Client SDKs**: Provide SDKs for different languages/frameworks
7. **Feature Flag Templates**: Reusable flag configurations

## Technology Stack Recommendations

### Core Services
- **API Service**: Node.js, Go, or Python (FastAPI)
- **Admin Service**: Node.js or Python
- **Database**: PostgreSQL or MongoDB
- **Cache**: Redis Cluster
- **CDN**: CloudFlare, AWS CloudFront, or Fastly

### Infrastructure
- **Message Queue**: Kafka, RabbitMQ, or AWS SQS
- **Load Balancer**: AWS ALB, Nginx, or HAProxy
- **Monitoring**: Prometheus + Grafana, Datadog, or New Relic
- **Logging**: ELK Stack, Splunk, or CloudWatch

### Deployment
- **Container Orchestration**: Kubernetes or Docker Swarm
- **CI/CD**: Jenkins, GitHub Actions, or GitLab CI
- **Infrastructure as Code**: Terraform or CloudFormation

