# Go Language Learning Strategy

A structured approach to familiarize yourself with the Go programming language, covering fundamentals, best practices, and practical application.

---

## 1. Learning Resources

**Core Documentation**
1. **Official Go Tour**
   - Interactive: https://go.dev/tour/
   - Covers: syntax, types, methods, interfaces, concurrency
2. **Effective Go**
   - Read: https://go.dev/doc/effective_go
   - Essential guide to idiomatic Go code
3. **Go by Example**
   - Browse: https://gobyexample.com/
   - Practical code examples for common patterns

**Recommended Reading**
- **The Go Programming Language** (book) — Alan Donovan & Brian Kernighan
- **Go Wiki** — https://github.com/golang/go/wiki
- **Go Blog** — https://go.dev/blog/ for articles on design decisions and best practices

---

## 2. Setup & Installation

```bash
# Install Go (check https://go.dev/dl/ for latest version)
# Windows: Download installer from go.dev/dl/
# macOS: brew install go
# Linux: sudo apt install golang-go  # or use snap/source

# Verify installation
go version

# Check GOPATH and GOROOT
go env GOPATH
go env GOROOT

# Initialize a new module (Go 1.11+)
mkdir go-learning && cd go-learning
go mod init github.com/yourusername/go-learning

# Create your first program
cat > main.go << 'EOF'
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
EOF

# Run it
go run main.go

# Build executable
go build -o hello main.go
./hello
```

---

## 3. Core Concepts to Master

### Phase 1: Fundamentals (Week 1-2)
- **Syntax basics**: variables, constants, types
- **Control flow**: if/else, for loops, switch statements
- **Functions**: parameters, return values, multiple returns
- **Data structures**: arrays, slices, maps, structs
- **Pointers**: understanding `*` and `&`
- **Methods**: receiver functions
- **Packages**: `package`, `import`, visibility (uppercase/lowercase)

### Phase 2: Intermediate (Week 3-4)
- **Interfaces**: defining and implementing interfaces
- **Error handling**: `error` type, `if err != nil` pattern
- **Defer, panic, recover**: resource management and error recovery
- **Goroutines**: `go` keyword, concurrent execution
- **Channels**: `chan`, sending/receiving, buffered channels
- **Select**: channel multiplexing
- **JSON**: `encoding/json` package, marshaling/unmarshaling

### Phase 3: Advanced (Week 5-6)
- **Context**: `context.Context` for cancellation and timeouts
- **Sync primitives**: `sync.Mutex`, `sync.WaitGroup`, `sync.Once`
- **Testing**: `testing` package, table-driven tests, benchmarks
- **Modules**: `go.mod`, dependency management, versioning
- **HTTP**: `net/http` package, handlers, middleware
- **File I/O**: reading/writing files, working with directories

---

## 4. Practical Exercises

### Beginner Projects
1. **CLI Calculator**
   - Accept arithmetic expressions
   - Parse and evaluate
   - Handle errors gracefully

2. **File Analyzer**
   - Read a file, count words/lines
   - Find most common words
   - Output statistics

3. **Todo CLI**
   - Add, list, complete, delete tasks
   - Persist to JSON file
   - Use structs and JSON encoding

### Intermediate Projects
4. **HTTP Server**
   - REST API with multiple endpoints
   - JSON request/response
   - Error handling middleware

5. **Concurrent Web Scraper**
   - Fetch multiple URLs concurrently
   - Use goroutines and channels
   - Collect and aggregate results

6. **Chat Server**
   - TCP server with multiple clients
   - Broadcast messages
   - Use channels for communication

### Advanced Projects
7. **Rate Limiter**
   - Implement token bucket algorithm
   - Use mutexes for thread safety
   - Test with concurrent requests

8. **Distributed Task Queue**
   - Producer/consumer pattern
   - Multiple workers
   - Graceful shutdown

---

## 5. Learning Path (6-Week Plan)

### Week 1: Basics & Syntax
- **Day 1-2**: Complete Go Tour sections 1-10 (packages, imports, functions)
- **Day 3-4**: Practice: variables, types, control flow exercises
- **Day 5-6**: Read Effective Go chapters 1-3
- **Day 7**: Build CLI Calculator project

### Week 2: Data Structures & Methods
- **Day 1-2**: Go Tour sections 11-20 (pointers, structs, slices, maps)
- **Day 3-4**: Practice: work with collections, implement methods
- **Day 5-6**: Read Effective Go chapters 4-5
- **Day 7**: Build File Analyzer project

### Week 3: Interfaces & Error Handling
- **Day 1-2**: Go Tour sections 21-25 (methods, interfaces)
- **Day 3-4**: Practice: implement interfaces, error handling patterns
- **Day 5-6**: Read Effective Go chapters 6-7
- **Day 7**: Build Todo CLI project

### Week 4: Concurrency Basics
- **Day 1-2**: Go Tour sections 26-30 (goroutines, channels)
- **Day 3-4**: Practice: concurrent programs, channel communication
- **Day 5-6**: Read "Concurrency in Go" articles from Go Blog
- **Day 7**: Build Concurrent Web Scraper project

### Week 5: Advanced Concurrency & Testing
- **Day 1-2**: Study `sync` package, `context` package
- **Day 3-4**: Practice: mutexes, wait groups, context cancellation
- **Day 5-6**: Learn testing: table-driven tests, benchmarks
- **Day 7**: Build Chat Server project (with tests)

### Week 6: HTTP & Real-World Patterns
- **Day 1-2**: Study `net/http` package, build REST API
- **Day 3-4**: Practice: middleware, routing, JSON handling
- **Day 5-6**: Study Go modules, dependency management
- **Day 7**: Build Rate Limiter project (with HTTP integration)

---

## 6. Best Practices Checklist

1. **Format code** — Always run `go fmt` before committing
2. **Follow naming conventions** — Exported names start with uppercase, unexported with lowercase
3. **Handle errors explicitly** — Never ignore `err` return values
4. **Prefer composition** — Use struct embedding over inheritance
5. **Keep packages focused** — One package, one responsibility
6. **Use interfaces** — Define interfaces where you use them, not where you implement them
7. **Write tests** — Test files end with `_test.go`, use table-driven tests
8. **Avoid panics** — Return errors instead of panicking in library code
9. **Use `defer`** — For cleanup (file closes, mutex unlocks)
10. **Document exports** — Comment all exported functions, types, and variables

---

## 7. Common Pitfalls to Avoid

- **Ignoring errors**: Always check `if err != nil`
- **Using `new()` instead of `make()`**: `make()` for slices/maps/channels, `new()` for pointers
- **Goroutine leaks**: Always ensure goroutines can exit
- **Race conditions**: Use mutexes or channels for shared state
- **Nil pointer dereferences**: Check for nil before dereferencing
- **Incorrect channel usage**: Closing channels incorrectly, sending to closed channels
- **Not using `go vet`**: Run `go vet ./...` to catch common mistakes

---

## 8. Tools & Commands

```bash
# Format code
go fmt ./...

# Run tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run benchmarks
go test -bench=.

# Build for current platform
go build ./...

# Install package
go install ./...

# Download dependencies
go mod download

# Tidy dependencies
go mod tidy

# Check for issues
go vet ./...

# Generate documentation
go doc <package>

# View module graph
go mod graph
```

---

## 9. Next Steps After Basics

Once comfortable with fundamentals:
- **Explore standard library**: `strings`, `time`, `regexp`, `crypto`, etc.
- **Study popular packages**: `gorilla/mux`, `gorm`, `viper`, `cobra`
- **Read Go code**: Study popular open-source Go projects
- **Contribute**: Find a Go project and submit a PR
- **Build a larger project**: CLI tool, web service, or microservice

---

## References

- **Go Official Docs** — https://go.dev/doc/
- **Go Tour** — https://go.dev/tour/
- **Effective Go** — https://go.dev/doc/effective_go
- **Go by Example** — https://gobyexample.com/
- **Go Blog** — https://go.dev/blog/
- **Go Wiki** — https://github.com/golang/go/wiki
- **Go Playground** — https://go.dev/play/
- **pkg.go.dev** — https://pkg.go.dev/ (package documentation)

