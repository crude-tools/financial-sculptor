    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            background: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
            card: "hsl(var(--card))",
            "card-foreground": "hsl(var(--card-foreground))",
            popover: "hsl(var(--popover))",
            "popover-foreground": "hsl(var(--popover-foreground))",
            primary: "hsl(var(--primary))",
            "primary-foreground": "hsl(var(--primary-foreground))",
            secondary: "hsl(var(--secondary))",
            "secondary-foreground": "hsl(var(--secondary-foreground))",
            muted: "hsl(var(--muted))",
            "muted-foreground": "hsl(var(--muted-foreground))",
            accent: "hsl(var(--accent))",
            "accent-foreground": "hsl(var(--accent-foreground))",
            destructive: "hsl(var(--destructive))",
            "destructive-foreground": "hsl(var(--destructive-foreground))",
            border: "hsl(var(--border))",
            input: "hsl(var(--input))",
            ring: "hsl(var(--ring))",
          },
          borderRadius: {
            lg: "var(--radius-lg)",
            md: "var(--radius-md)",
            sm: "var(--radius-sm)",
          },
          fontFamily: {
            sans: ["Inter", "sans-serif"],
            heading: ["Sora", "sans-serif"],
          },
          keyframes: {
            "background-pan": {
              "0%": { transform: "translate(-50%, -50%) rotate(0deg)" },
              "100%": { transform: "translate(-50%, -50%) rotate(360deg)" },
            },
            "fade-in": {
              "0%": { opacity: 0, transform: "translateY(10px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          },
          animation: {
            "background-pan": "background-pan 25s infinite alternate ease-in-out",
            "fade-in": "fade-in 0.6s ease-out forwards",
          },
        },
      },
      plugins: [],
    };