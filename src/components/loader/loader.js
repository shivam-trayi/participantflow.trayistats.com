import React, { useEffect } from 'react';

const MyLoader = () => {
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    return (
        <div style={{
            position: "fixed",
            width: "100%",
            height: "100vh",
            top: 0,
            left: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
        }} className="loader-fade-in gradient-background">
            <img
                src={process.env.PUBLIC_URL + '/spinner.png'}
                alt="loading"
                style={{ width: "60px", animation: "spin 2s linear infinite", marginBottom: "1.5rem" }}
            />
            <h2 style={{
                margin: "0",
                color: "#2b6cb0",
                fontSize: "1.5rem",
                fontWeight: "600",
                textAlign: "center",
                animation: "pulse 2s infinite"
            }}>
                Hang tight!
            </h2>
            <p style={{
                margin: "0.5rem 0 0",
                color: "#4a5568",
                fontSize: "1rem",
                textAlign: "center"
            }}>
                Your survey will start shortly<span className="loading-dots"></span>
            </p>
        </div>
    )
}

export default MyLoader;