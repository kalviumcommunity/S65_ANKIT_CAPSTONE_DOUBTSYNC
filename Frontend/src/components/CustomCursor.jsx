import React, { useEffect } from "react";
import styles from "./css/CustomCursor.module.css";

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.getElementById("fancyCursor");
    const trail = document.getElementById("fancyTrail");
    const burst = document.getElementById("clickBurst");

    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;

    const updateCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
      burst.style.left = `${mouseX}px`;
      burst.style.top = `${mouseY}px`;
    };

    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.15;
      trailY += (mouseY - trailY) * 0.15;

      trail.style.left = `${trailX}px`;
      trail.style.top = `${trailY}px`;

      requestAnimationFrame(animateTrail);
    };

    document.addEventListener("mousemove", updateCursor);

    document.addEventListener("click", () => {
      burst.classList.add(styles["burst-animate"]);
      setTimeout(() => burst.classList.remove(styles["burst-animate"]), 400);
    });

    animateTrail();

    document.body.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", updateCursor);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <div className={styles["cursor-wrapper"]}>
      <div className={styles["fancy-cursor"]} id="fancyCursor"></div>
      <div className={styles["fancy-trail"]} id="fancyTrail"></div>
      <div className={styles["cursor-clickburst"]} id="clickBurst"></div>
    </div>
  );
};

export default CustomCursor;
