import React from 'react';

const DarkMode = () => {
  const [theme, setTheme] = React.useState(localStorage.getItem("theme") || "light");

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="relative">
      {/* Light mode icon */}
      <img
        onClick={toggleTheme}
        src="https://eshop-1202.netlify.app/assets/light-mode-button-Bfg5ccV9.png"
        alt="Light Mode"
        className={`w-14 cursor-pointer absolute z-10 ${
          theme === "dark" ? "opacity-0" : "opacity-100"
        } transition-all duration-300`}
      />
      {/* Dark mode icon */}
      <img
        onClick={toggleTheme}
        src="https://eshop-1202.netlify.app/assets/dark-mode-button-DzmMGSE6.png"
        alt="Dark Mode"
        className={`w-14 cursor-pointer ${
          theme === "dark" ? "opacity-100" : "opacity-0"
        } transition-all duration-300`}
      />
    </div>
  );
};

export default DarkMode;