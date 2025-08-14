# Fast Python 2025 — uv + Pydantic v2 + Dev Best Practices

A fast-track guide for engineers who already know some Python and want to quickly get current with **modern tooling**:
- [`uv`](https://docs.astral.sh/uv/) for Python env/dependency/tool management
- [`pydantic`](https://docs.pydantic.dev/latest/) v2 for data models & validation
- [`pydantic-settings`](https://docs.pydantic.dev/latest/integrations/pydantic_settings/) for 12-factor configuration
- [`ruff`](https://docs.astral.sh/ruff/) for linting & formatting
- [`pytest`](https://docs.pytest.org/en/stable/getting-started.html) for testing

---

## 1. Learning Resources

**Core**
1. **uv**
   - Read: [First steps](https://docs.astral.sh/uv/getting-started/), [Using tools](https://docs.astral.sh/uv/concepts/tools/), [Dependency groups](https://docs.astral.sh/uv/guides/projects/#dependency-groups)
2. **Pydantic v2**
   - Read: [Models](https://docs.pydantic.dev/latest/usage/models/), [Validation](https://docs.pydantic.dev/latest/concepts/validators/), [Migration to v2](https://docs.pydantic.dev/latest/migration/)
3. **pydantic-settings**
   - Read: [Integration docs](https://docs.pydantic.dev/latest/integrations/pydantic_settings/)
4. **Ruff**
   - Read: [Linter](https://docs.astral.sh/ruff/linter/), [Formatter](https://docs.astral.sh/ruff/formatter/)
5. **pytest**
   - Read: [Getting started](https://docs.pytest.org/en/stable/getting-started.html), [Fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html)

**Optional fast reads**
- [uvx explained](https://docs.astral.sh/uv/concepts/tools/)
- [PEP 735: dependency groups](https://peps.python.org/pep-0735/)

---

## 2. One-shot Setup

```bash
# Install uv (single binary)
curl -LsSf https://astral.sh/uv/install.sh | sh

# New project
mkdir fast-python && cd fast-python
uv init .
uv python pin 3.11  # or 3.12/3.13

# Add runtime deps
uv add pydantic pydantic-settings

# Dev tooling in a dependency group
uv add --group dev ruff pytest

# Sync from lockfile
uv lock && uv sync

# Run tools without installing globally
uvx ruff --version
uvx pytest -q
```

---

## 3. Minimal, Idiomatic Starter

**`pyproject.toml`**
```toml
[project]
name = "fast-python"
version = "0.1.0"
requires-python = ">=3.11"

[dependency-groups]
dev = ["ruff", "pytest"]
```

**`app/models.py`**
```python
from pydantic import BaseModel, field_validator

class User(BaseModel):
    id: int
    email: str
    is_active: bool = True

    @field_validator("email")
    @classmethod
    def ensure_at_symbol(cls, v: str) -> str:
        if "@" not in v:
            raise ValueError("invalid email")
        return v
```

**`app/settings.py`**
```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="APP_")

    debug: bool = False
    database_url: str

settings = Settings()
```

**`tests/test_user.py`**
```python
from app.models import User
import pytest

def test_email_validation():
    with pytest.raises(ValueError):
        User(id=1, email="nope")

def test_defaults():
    u = User(id=1, email="a@b.com")
    assert u.is_active is True
```

**Run it**
```bash
uv run python -c "from app.settings import settings; print(settings.model_dump())"
uvx pytest -q
uvx ruff check . && uvx ruff format .
```

---

## 4. Best Practices Checklist

1. **Single toolchain** — Use `uv` for Python pinning, locking, syncing, and tool running (`uvx`). Keep dev tools in dependency groups; commit `uv.lock`.
2. **Type-first + validation at boundaries** — Use Pydantic models at IO edges (API, CLI, DB), not everywhere. Keep core domain objects as plain typed classes unless validation is required.
3. **12-factor config** — Use `pydantic-settings` to load from `.env` locally, env vars in CI/prod. Avoid manual `os.getenv` calls.
4. **One tool for lint + format** — Use Ruff for both; configure in `pyproject.toml`.
5. **pytest fixtures** — Prefer small, composable fixtures instead of large setup/teardown blocks. Keep tests alongside code or in a `tests/` folder.
6. **No global installs** — Run tools with `uv run` or `uvx`; only install globally if unavoidable.

---

## 5. 7-day “Get Current” Micro-Plan (30–60 min/day)

- **Day 1**: Read uv *First steps*. Convert one existing project to `uv init`, `uv add`, `uv lock && uv sync`.
- **Day 2**: Add `ruff` + `pytest` via dependency groups.
- **Day 3**: Replace ad-hoc dicts with Pydantic models at your input boundary.
- **Day 4**: Introduce `pydantic-settings` for config; remove hard-coded constants.
- **Day 5**: Write 5–10 focused pytest tests using fixtures.
- **Day 6**: Tweak `pyproject.toml` — scripts, Ruff rules you care about.
- **Day 7**: Learn `uvx` for one-offs; try pinning Python and `uv tool install` for any daily-driver CLIs.

---

## References

- uv docs — https://docs.astral.sh/uv/
  - Getting started — https://docs.astral.sh/uv/getting-started/
  - Tools (uvx) — https://docs.astral.sh/uv/concepts/tools/
  - Dependency groups — https://docs.astral.sh/uv/guides/projects/#dependency-groups
- Pydantic v2 — https://docs.pydantic.dev/latest/
  - Models — https://docs.pydantic.dev/latest/usage/models/
  - Validators — https://docs.pydantic.dev/latest/concepts/validators/
  - Migration — https://docs.pydantic.dev/latest/migration/
- pydantic-settings — https://docs.pydantic.dev/latest/integrations/pydantic_settings/
- Ruff — https://docs.astral.sh/ruff/
  - Linter — https://docs.astral.sh/ruff/linter/
  - Formatter — https://docs.astral.sh/ruff/formatter/
- pytest — https://docs.pytest.org/en/stable/getting-started.html
  - Fixtures — https://docs.pytest.org/en/stable/how-to/fixtures.html
- PEP 735 (dependency groups) — https://peps.python.org/pep-0735/
