---
name: playwright
description: Browser automation with Playwright MCP. Use for web scraping, testing, screenshots, and browser interactions
mcp:
  playwright:
    command: npx
    args:
      - "@playwright/mcp@latest"
---

# Playwright Browser Automation Skill

This skill provides comprehensive browser automation capabilities via the Playwright MCP server.

## Capabilities

### Web Scraping
- Navigate to URLs and extract content
- Scrape structured data from web pages
- Handle dynamic content and SPAs
- Extract text, links, images, and metadata

### Browser Testing
- Automated functional testing
- End-to-end test scenarios
- Form submission and validation
- Navigation flow testing

### Screenshots & Media
- Take full-page screenshots
- Capture specific elements
- Record videos of browser sessions
- Generate PDFs from web pages

### Interactions
- Click buttons and links
- Fill forms and input fields
- Handle dialogs and popups
- Execute JavaScript in page context

## Usage Examples

### Basic Navigation & Screenshot
```
Use the playwright skill to take a screenshot of https://example.com
```

### Web Scraping
```
Use playwright to scrape all product titles and prices from https://shop.example.com/products
```

### Form Testing
```
Use playwright to test the login form at https://app.example.com/login
- Fill email: test@example.com
- Fill password: testpass123
- Click login button
- Verify redirect to dashboard
```

### Dynamic Content
```
Use playwright to extract article content from https://news.example.com after page loads completely
```

## Supported Browsers

- Chromium
- Firefox
- WebKit (Safari)

## Best Practices

### 1. Always Specify Full URLs
```
✓ https://example.com/page
✗ example.com
```

### 2. Be Specific About Selectors
```
✓ Click the "Submit" button with class "btn-primary"
✗ Click the submit button
```

### 3. Handle Dynamic Content
```
✓ Wait for the product list to load, then extract prices
✗ Immediately extract prices (may not be loaded yet)
```

### 4. Use Appropriate Timeouts
```
✓ Wait up to 10 seconds for slow-loading pages
✗ Default 5 second timeout for slow pages
```

## Common Tasks

### Screenshot Website
```
Task: Take a screenshot of https://example.com
Expected: PNG image file or base64-encoded image
```

### Extract Data
```
Task: Extract all headings (h1, h2, h3) from https://docs.example.com
Expected: Structured list of headings with hierarchy
```

### Test Form
```
Task: Fill out contact form at https://example.com/contact
- Name: John Doe
- Email: john@example.com
- Message: Test message
- Click Submit
Expected: Success message or redirect confirmation
```

### Check Element
```
Task: Check if element with id "user-profile" exists on https://app.example.com/dashboard
Expected: Boolean result (true/false)
```

## Advanced Usage

### Wait for Conditions
```
Use playwright to wait for element with class "data-loaded" to appear, 
then extract the table data from https://app.example.com/reports
```

### Execute JavaScript
```
Use playwright to navigate to https://example.com and execute:
  document.querySelector('.modal').style.display = 'none'
Then take a screenshot
```

### Multiple Steps
```
Use playwright to:
1. Navigate to https://example.com
2. Click "Products" link
3. Filter by category "Electronics"
4. Extract first 10 product names and prices
5. Return as JSON
```

## Tips & Tricks

### 1. Debugging
```
Use playwright with verbose mode to see detailed browser actions
```

### 2. Performance
```
Use headless mode for faster execution (default)
Use headed mode only when debugging
```

### 3. Reliability
```
Use data attributes instead of classes for selectors
Wait for network idle before extracting data
Use explicit waits instead of fixed timeouts
```
