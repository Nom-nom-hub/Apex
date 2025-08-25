# Contributing to Apex

Thank you for your interest in contributing to Apex! We welcome contributions from the community and are excited to work with you.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## How to Contribute

### Reporting Bugs

Before submitting a bug report, please check if the issue has already been reported. If not, create a new issue using the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md).

When reporting a bug, please include:
- A clear and concise description of the issue
- Steps to reproduce the behavior
- Expected vs. actual behavior
- Environment information (OS, browser, Apex version, etc.)

### Suggesting Enhancements

Feature requests and enhancements are welcome! Please use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md) when submitting your idea.

Before submitting, check if a similar request already exists. If not, create a new issue with:
- A clear and concise description of the enhancement
- Explanation of the problem it solves
- Any implementation ideas or alternatives you've considered

### Pull Requests

We actively welcome your pull requests! Here's how to contribute code:

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass
6. Update documentation as needed
7. Submit a pull request

#### Development Setup

1. Clone your fork of the repository
2. Install dependencies with `pnpm install`
3. Run tests with `pnpm test`
4. Build packages with `pnpm build`

#### Code Style

- Follow the existing code style in the project
- Use TypeScript for all new code
- Add JSDoc/TSDoc comments for public APIs
- Keep functions small and focused
- Write clear, descriptive commit messages

#### Testing

- Add unit tests for new functionality
- Ensure all existing tests pass
- Write integration tests for major features
- Test across different environments when applicable

#### Commit Messages

Follow the conventional commit format:
- `feat(scope): description` for new features
- `fix(scope): description` for bug fixes
- `docs(scope): description` for documentation changes
- `chore(scope): description` for maintenance tasks

Example:
```
feat(router): add support for dynamic route parameters

- Add support for [param] syntax in route paths
- Implement parameter extraction in route matching
- Add tests for dynamic routes

Closes #123
```

## Development Workflow

### Branching Strategy

- `main` - Latest stable release
- Feature branches - For new features and enhancements
- Bugfix branches - For bug fixes

### Versioning

We follow [Semantic Versioning](https://semver.org/) for releases:
- MAJOR version for incompatible API changes
- MINOR version for backwards-compatible functionality
- PATCH version for backwards-compatible bug fixes

### Release Process

1. Create a release branch from main
2. Update version numbers in package.json files
3. Update CHANGELOG.md with release notes
4. Create a git tag with the version number
5. Publish packages to npm
6. Create a GitHub release

## Code Review Process

All pull requests are reviewed by maintainers before merging. The review process focuses on:

- Code correctness and quality
- Test coverage and quality
- Documentation completeness
- Performance considerations
- Security implications
- Adherence to project conventions

## Community Comming Soon...

Join our community to connect with other contributors and users:

- [Discord](https://discord.gg/apex-framework) - Real-time chat and support (coming soon)
- [Twitter](https://twitter.com/apex_framework) - Announcements and updates (coming soon)
- [Blog](https://apex.dev/blog) - In-depth articles and tutorials (coming soon)
- [GitHub](https://github.com/Nom-nom-hub/Apex)

## License

By contributing to Apex, you agree that your contributions will be licensed under the MIT License.
