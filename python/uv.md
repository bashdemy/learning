## uv: features and quick-use notes

Reference: see the official features page: [uv — Features](https://docs.astral.sh/uv/getting-started/features/).

uv provides essential features for Python development — from installing Python and hacking on simple scripts to working on large projects that support multiple Python versions and platforms.

### Python versions
- **Install**: `uv python install <version>`
- **List available**: `uv python list`
- **Find installed**: `uv python find <version>`
- **Pin project Python**: `uv python pin <version>`
- **Uninstall**: `uv python uninstall <version>`

Typical flow:
```bash
uv python install 3.12
uv python pin 3.12
```

### Scripts (standalone .py files)
- **Run a script**: `uv run <script.py> [args...]`
- **Add a dependency for a script**: `uv add --script <package>`
- **Remove a dependency for a script**: `uv remove --script <package>`

Example:
```bash
uv add --script requests
uv run example.py
```

### Projects (with `pyproject.toml`)
- **Init a project**: `uv init`
- **Add/remove deps**: `uv add <pkg> [--dev]` / `uv remove <pkg>`
- **Sync env with lock**: `uv sync`
- **Lock dependencies**: `uv lock`
- **Run a command in env**: `uv run <cmd> [args...]`
- **Inspect dependency tree**: `uv tree`
- **Build distributions**: `uv build`
- **Publish to index**: `uv publish`

Typical flow:
```bash
uv init
uv add fastapi uvicorn
uv lock
uv sync
uv run uvicorn app:app --reload
```

### Tools (user-wide CLI tools from Python packages)
- **Run without installing**: `uvx <tool> [args...]` (alias of `uv tool run`)
- **Install tool**: `uv tool install <package>`
- **Uninstall tool**: `uv tool uninstall <package>`
- **List installed tools**: `uv tool list`
- **Update shell PATH shims**: `uv tool update-shell`

Examples:
```bash
uvx ruff check .
uv tool install black
black --version
```

### The pip interface (manual env + package management)
Environments (replacement for `venv`/`virtualenv`):
- **Create venv**: `uv venv [<path>]`

Packages (replacement for `pip` and `pipdeptree`):
- **Install**: `uv pip install <pkgs...>`
- **Show**: `uv pip show <pkg>`
- **Freeze**: `uv pip freeze`
- **Check compatibility**: `uv pip check`
- **List**: `uv pip list`
- **Uninstall**: `uv pip uninstall <pkgs...>`
- **Tree**: `uv pip tree`

Locking (replacement for `pip-tools`):
- **Compile to lockfile**: `uv pip compile [-o requirements.lock] requirements.in`
- **Sync env from lockfile**: `uv pip sync <lockfile>`

Note: These commands are not exact drop-in replacements for their counterparts; see pip-compatibility notes on the features page.

### Utility
- **Clean cache**: `uv cache clean`
- **Prune outdated cache**: `uv cache prune`
- **Show cache dir**: `uv cache dir`
- **Show tools dir**: `uv tool dir`
- **Show installed Pythons dir**: `uv python dir`
- **Self-update**: `uv self update`

### Practical tips
- **Prefer project workflows**: use `uv init`, `uv add`, `uv lock`, `uv sync`, and `uv run` for reproducible environments.
- **Pin Python early**: `uv python pin <version>` ensures consistency across machines and CI.
- **One-off tooling**: use `uvx` to avoid polluting your global environment.
- **Inspect deps**: `uv tree` (project) or `uv pip tree` (env) to understand dependency graphs.

For deeper guidance, see the official docs: [uv — Features](https://docs.astral.sh/uv/getting-started/features/).


