```markdown
# AGENTS.md - AI Coding Agent Guidelines

These guidelines are designed to ensure high-quality, maintainable, and productive AI coding agent development within the AGENTS.md repository. Adherence to these principles is mandatory for all development activities.

## 1. DRY (Don't Repeat Yourself)

*   **Single Responsibility Principle:** Each agent should have a single, clearly defined purpose. Avoid creating multiple agents with overlapping functionality.
*   **Abstraction:**  Use abstraction to decouple components and reduce redundancy.  Implement common functionalities into reusable components.
*   **Code Reuse:**  Identify and reuse existing code where possible, prioritizing established patterns.
*   **Configuration over Code:** Favor configuration over hardcoded values whenever feasible to enhance flexibility.

## 2. KISS (Keep It Simple, Stupid)

*   **Minimalist Design:** Strive for the simplest solution that meets the requirements.  Avoid unnecessary complexity.
*   **Readability:** Code should be easy to understand and maintain. Employ clear variable names, comments, and formatting.
*   **Avoid Over-Engineering:** Resist premature optimization.  Prioritize clarity and correctness.

## 3. SOLID Principles

*   **Single Responsibility:**  Each class/agent should have one primary responsibility.
*   **Open/Closed Principle:**  The system should be extensible through new classes/agents without modifying existing code.  (Existing Agents may be modified via API calls).
*   **Liskov Substitution Principle:**  Subclasses should be able to replace a base class without altering the correctness of the program.
*   **Interface Segregation Principle:**  Clients shouldn't be forced to implement interfaces they don’t use.
*   **Dependency Inversion Principle:**  High-level modules (agents) should not depend on low-level modules (implementation details). Use abstraction.

## 4. YAGNI (You Aren't Gonna Need It)

*   **Future-Proofing:**  Don't add features or functionality that is not currently required.
*   **Avoid Unnecessary Code:** Refactor to eliminate code that is not directly used or relevant.

## 5. Development Practices

*   **Code Reviews:** All code changes must undergo thorough code reviews before merging.
*   **Unit Tests:**  A minimum of 80% of code must be covered by unit tests.  Test all individual functions/agents.
*   **Integration Tests:**  Comprehensive integration tests should validate the interaction between different agents and components.
*   **Automated Testing:**  Utilize automated testing frameworks to ensure code quality and prevent regressions.
*   **Documentation:**  Document key functionalities, design decisions, and assumptions.
*   **Versioning:** Employ a consistent versioning strategy for all code and configuration files.
*   **Configuration Management:** Utilize a configuration management system (e.g., YAML, JSON) to manage configuration parameters.
*   **Error Handling:** Implement robust error handling and logging.
*   **Security:**  Adhere to security best practices throughout development.
*   **Code Style:**  Follow a consistent code style guide (e.g., PEP 8 for Python).

## 6. File Limit: 180 Lines

*   Each file's maximum length is 180 lines.  Ensure all code fits within this limit.

## 7.  Testing Frameworks

*   Utilize a testing framework (e.g., pytest, unittest) for all automated tests.
*   Establish a clear suite of tests covering core functionality and critical edge cases.

## 8.  Deliverables

*   **Documentation:**  Maintain up-to-date documentation within the AGENTS.md file.
*   **Unit Tests:**  Published unit test suites.
*   **Code Reviews:**  Completed code reviews.

## 9.  Configuration

*   Use clear and concise configuration options.
*   Avoid excessive configuration.

## 10.  Project Structure

*   Organize code into logical modules/components.
*   Define a well-defined project hierarchy.

## 11.  Maintenance

*   Prioritize code maintainability and readability.
*   Document any significant changes or refactorings.

These guidelines are intended to provide a framework for development.  Ongoing evaluation and adjustment are encouraged.
```