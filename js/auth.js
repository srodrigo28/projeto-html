/**
 * Mock Authentication System
 * Simulates Supabase-like authentication using localStorage
 */

const Auth = {
    // Simulates a database of users in localStorage
    getUsers: () => {
        const users = localStorage.getItem('mock_users');
        return users ? JSON.parse(users) : [];
    },

    saveUser: (user) => {
        const users = Auth.getUsers();
        users.push(user);
        localStorage.setItem('mock_users', JSON.stringify(users));
    },

    // Register a new user
    signUp: async (email, password, name) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = Auth.getUsers();
                if (users.find(u => u.email === email)) {
                    reject({ error: 'User already exists' });
                    return;
                }

                const newUser = {
                    id: Date.now().toString(),
                    email,
                    password, // In a real app, never store plain text passwords!
                    name,
                    created_at: new Date().toISOString()
                };

                Auth.saveUser(newUser);
                
                // Auto login after register
                const session = {
                    user: {
                        id: newUser.id,
                        email: newUser.email,
                        name: newUser.name
                    },
                    access_token: 'mock_token_' + Date.now()
                };
                localStorage.setItem('sb-session', JSON.stringify(session));
                
                resolve({ data: { user: newUser, session }, error: null });
            }, 500); // Simulate network delay
        });
    },

    // Login existing user
    signIn: async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = Auth.getUsers();
                const user = users.find(u => u.email === email && u.password === password);

                if (!user) {
                    reject({ error: 'Invalid email or password' });
                    return;
                }

                const session = {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    },
                    access_token: 'mock_token_' + Date.now()
                };
                localStorage.setItem('sb-session', JSON.stringify(session));

                resolve({ data: { user, session }, error: null });
            }, 500);
        });
    },

    // Logout
    signOut: async () => {
        return new Promise((resolve) => {
            localStorage.removeItem('sb-session');
            resolve({ error: null });
        });
    },

    // Get current session
    getSession: () => {
        const session = localStorage.getItem('sb-session');
        return session ? JSON.parse(session) : null;
    },

    // Check if user is authenticated and redirect if not
    requireAuth: () => {
        const session = Auth.getSession();
        if (!session) {
            window.location.href = 'login.html';
        }
        return session;
    },

    // Redirect to dashboard if already logged in
    redirectIfAuthenticated: () => {
        const session = Auth.getSession();
        if (session) {
            window.location.href = 'index.html';
        }
    }
};

// Expose to window for easy access
window.Auth = Auth;
