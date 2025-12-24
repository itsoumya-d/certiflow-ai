/**
 * Framer Motion Animation Variants
 * Centralized animation definitions for consistent UI motion
 */

// Standard entrance animation - fade in while sliding up
export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
};

// Fade in from left
export const fadeInLeft = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
};

// Fade in from right
export const fadeInRight = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
};

// Simple fade
export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
};

// Scale in animation
export const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
};

// Container for staggering children
export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};

// Faster stagger for lists
export const staggerContainerFast = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.05
        }
    }
};

// Slow stagger for hero sections
export const staggerContainerSlow = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

// Child item for stagger containers
export const staggerChild = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    }
};

// Hover scale effect for cards
export const hoverScale = {
    whileHover: {
        scale: 1.02,
        transition: { duration: 0.2 }
    },
    whileTap: { scale: 0.98 }
};

// Hover lift effect (translateY)
export const hoverLift = {
    whileHover: {
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
    }
};

// Hover glow effect (for use with box-shadow)
export const hoverGlow = {
    whileHover: {
        boxShadow: "0 0 60px -15px rgba(16, 185, 129, 0.5)",
        transition: { duration: 0.3 }
    }
};

// Pulsing animation for live indicators
export const pulse = {
    animate: {
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Gentle float animation
export const float = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Shimmer effect for loading states
export const shimmer = {
    animate: {
        backgroundPosition: ["200% 0", "-200% 0"],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
        }
    }
};

// Modal/Dialog animations
export const modalBackdrop = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
};

export const modalContent = {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 },
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
};

// Toast/notification animations
export const toastSlideIn = {
    initial: { opacity: 0, x: 100, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 100, scale: 0.9 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
};

// Sidebar nav item indicator
export const navIndicator = {
    layoutId: "nav-indicator",
    transition: { type: "spring", stiffness: 500, damping: 35 }
};

// Number counter animation helper
export const countUp = (value: number, duration: number = 1) => ({
    initial: { value: 0 },
    animate: { value },
    transition: { duration, ease: "easeOut" }
});

// Page transition variants
export const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3 }
    }
};
