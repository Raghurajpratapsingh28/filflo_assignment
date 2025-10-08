# 🤝 Contributing to FilFlo

Thank you for your interest in contributing to FilFlo! We welcome contributions from the community and are grateful for your help in making this project better.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.0.0 or higher
- **PostgreSQL** 12.0 or higher
- **npm** 9.0.0 or higher
- **Git** for version control

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/filflo.git
   cd filflo
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/originalowner/filflo.git
   ```

## 🛠️ Development Setup

### Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Set up your local database
createdb inventory_db

# Run migrations
npm run migrate

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration

Create a `.env` file in the Backend directory with your local settings:

```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-development-secret-key
CORS_ORIGIN=http://localhost:5174
```

## 📝 Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

- 🐛 **Bug Fixes** - Fix existing issues
- ✨ **New Features** - Add new functionality
- 📚 **Documentation** - Improve documentation
- 🧪 **Tests** - Add or improve tests
- 🎨 **UI/UX Improvements** - Enhance user interface
- ⚡ **Performance** - Optimize performance
- 🔒 **Security** - Improve security

### Before You Start

1. **Check existing issues** - Look for open issues that match your interests
2. **Create an issue** - For new features, create an issue first to discuss
3. **Assign yourself** - Comment on the issue to let others know you're working on it

## 🔄 Development Workflow

### 1. Create a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b docs/your-documentation-update
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

**Backend Testing:**
```bash
cd Backend
npm test
npm run test:watch  # For continuous testing
```

**Frontend Testing:**
```bash
cd dashboard
npm run typecheck
npm run lint
```

### 4. Commit Your Changes

Use clear, descriptive commit messages:

```bash
# Good commit messages
git commit -m "feat: add user profile editing functionality"
git commit -m "fix: resolve inventory filtering bug"
git commit -m "docs: update API documentation for new endpoints"

# Bad commit messages
git commit -m "fix stuff"
git commit -m "updates"
git commit -m "changes"
```

### 5. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

## 📋 Pull Request Process

### Before Submitting

- [ ] **Code Quality**: Ensure your code follows the project's style guidelines
- [ ] **Tests**: All tests pass and new tests are added for new functionality
- [ ] **Documentation**: Update documentation for any API changes
- [ ] **Type Safety**: All TypeScript types are properly defined
- [ ] **Performance**: Consider performance implications of your changes
- [ ] **Security**: Ensure no security vulnerabilities are introduced

### Pull Request Template

When creating a pull request, please include:

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Review Process

1. **Automated Checks** - CI/CD pipeline runs tests and linting
2. **Code Review** - Maintainers review your code
3. **Feedback** - Address any feedback or requested changes
4. **Approval** - Once approved, your PR will be merged

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: OS, Node.js version, browser version
- **Screenshots**: If applicable, add screenshots
- **Logs**: Any relevant error logs or console output

### Feature Requests

For feature requests, please include:

- **Description**: Clear description of the feature
- **Use Case**: Why this feature would be useful
- **Proposed Solution**: How you think it should work
- **Alternatives**: Any alternative solutions you've considered

## 🎨 Code Style Guidelines

### TypeScript

- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

```typescript
/**
 * Calculates inventory ageing in days
 * @param mfgDate - Manufacturing date
 * @param currentDate - Current date (optional, defaults to now)
 * @returns Number of days since manufacturing
 */
const calculateAgeing = (mfgDate: Date, currentDate: Date = new Date()): number => {
  return Math.floor((currentDate.getTime() - mfgDate.getTime()) / (1000 * 60 * 60 * 24));
};
```

### React Components

- Use functional components with hooks
- Define prop interfaces
- Use meaningful component names
- Implement proper error boundaries

```typescript
interface ComponentProps {
  title: string;
  onAction: () => void;
  disabled?: boolean;
}

const MyComponent: React.FC<ComponentProps> = ({ title, onAction, disabled = false }) => {
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onAction} disabled={disabled}>
        Action
      </button>
    </div>
  );
};
```

### Backend Code

- Use async/await for asynchronous operations
- Implement proper error handling
- Use middleware for common functionality
- Follow RESTful API conventions

```typescript
export const getInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 50, ...filters } = req.query;
    
    const inventory = await InventoryService.getInventory(filters, {
      page: Number(page),
      limit: Number(limit)
    });
    
    res.json({
      success: true,
      data: inventory.data,
      total: inventory.total,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    next(error);
  }
};
```

## 🧪 Testing Guidelines

### Backend Testing

- Write unit tests for all utility functions
- Test API endpoints with integration tests
- Mock external dependencies
- Aim for high test coverage

```typescript
describe('calculateAgeing', () => {
  it('should calculate correct ageing days', () => {
    const mfgDate = new Date('2024-01-01');
    const currentDate = new Date('2024-01-31');
    
    const result = calculateAgeing(mfgDate, currentDate);
    
    expect(result).toBe(30);
  });
});
```

### Frontend Testing

- Test component rendering
- Test user interactions
- Test API integration
- Use React Testing Library best practices

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render with correct title', () => {
    render(<MyComponent title="Test Title" onAction={jest.fn()} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
  
  it('should call onAction when button is clicked', () => {
    const mockAction = jest.fn();
    render(<MyComponent title="Test" onAction={mockAction} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(mockAction).toHaveBeenCalledTimes(1);
  });
});
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for functions and classes
- Document complex algorithms
- Include usage examples
- Keep README files updated

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error codes and messages
- Keep OpenAPI/Swagger specs updated

## 🏷️ Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

### Changelog

Update the CHANGELOG.md file with:

- New features
- Bug fixes
- Breaking changes
- Deprecations

## 🆘 Getting Help

### Communication Channels

- **GitHub Issues** - For bug reports and feature requests
- **GitHub Discussions** - For general questions and discussions
- **Pull Request Comments** - For code review discussions

### Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🙏 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project documentation

## 📄 License

By contributing to FilFlo, you agree that your contributions will be licensed under the MIT License.

---

<div align="center">

**Thank you for contributing to FilFlo! 🎉**

Every contribution, no matter how small, makes a difference.

</div>
