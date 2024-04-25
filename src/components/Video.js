"use client";
import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const { options, onReady } = props;

  React.useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));

      player.ready(() => {
        const controlBar = player.controlBar;

        const forwardButtonEl = videojs.dom.createEl("button", {
          className: "vjs-button",
          innerHTML: `<span class="vjs-icon-placeholder">+10s</span>`,
        });

        forwardButtonEl.addEventListener("click", () => {
          player.currentTime(player.currentTime() + 10);
        });

        controlBar.el().appendChild(forwardButtonEl);

        const backwardButtonEl = videojs.dom.createEl("button", {
          className: "vjs-button",
          innerHTML: `<span class="vjs-icon-placeholder">-10s</span>`,
        });

        backwardButtonEl.addEventListener("click", () => {
          player.currentTime(player.currentTime() - 10);
        });

        controlBar.el().appendChild(backwardButtonEl);
      });

      videoElement.addEventListener("dblclick", (event) => {
        const playerWidth = playerRef.current.el().offsetWidth;
        const offsetX = event.offsetX;
        const seekTime = offsetX > playerWidth / 2 ? 10 : -10;
        player.currentTime(player.currentTime() + seekTime);
      });
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;
