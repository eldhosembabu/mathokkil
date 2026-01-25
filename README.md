# Eldhose's Portfolio Website

This is a premium, responsive portfolio website designed to be hosted on Firebase Hosting.

## Customization

1.  **Personal Info**: Edit `public/index.html` to update your biography, project details, and contact information.
2.  **Styles**: Modify `public/style.css` to change the color scheme (variables are at the top).
3.  **Images/Icons**: The current design uses CSS shapes and FontAwesome placeholders. You can replace the FontAwesome generic kit or add your own SVGs.

## Local Development

You can view the site locally by simply opening `public/index.html` in your browser.

For a better experience (hot reloading), you can use a simple HTTP server:
```bash
npx serve public
```

## Deployment to Firebase

1.  **Install Firebase CLI** (if not already installed):
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login to Firebase**:
    ```bash
    firebase login
    ```

3.  **Initialize Project** (to link to your Firebase project):
    ```bash
    firebase init hosting
    # Select "Use an existing project" or "Create a new project"
    # When asked for the public directory, type: public
    # Configure as a single-page app? Yes (optional, but good for SPAs)
    # Set up automatic builds and deploys with GitHub? (Your choice)
    # Overwrite public/index.html? NO (Important: Do not overwrite the file we created)
    ```

4.  **Deploy**:
    ```bash
    firebase deploy
    ```

Your site will be live at `https://<your-project-id>.web.app`.
