// ==UserScript==
// @name         YouTube Ad M\te
// @version      0.1
// @description  Automatically mutes youtube Ads
// @author       fireltom
// @namespace    https://github.com/fireltom/Userscripts
// @homepageURL  https://github.com/fireltom/Userscripts/tree/main/YouTube_Ad_M%5Cte
// @license      MIT License
// @grant        none
// @noframes
// @match        *://*.youtube.com/*
// @updateURL    https://github.com/fireltom/Userscripts/raw/main/YouTube_Ad_M%5Cte/YouTube_Ad_M%5Cte_script.js
// @downloadURL  https://github.com/fireltom/Userscripts/raw/main/YouTube_Ad_M%5Cte/YouTube_Ad_M%5Cte_script.js
// ==/UserScript==

/*
.This is a simple Script to mute video ads on YouTube automatically.
.You want to help your favorite YouTuber but you don't want to hear the same ad, over and over again?
.Then this is for you!
.The script mutes and speeds up advertisements before and while the video, it also closes lower video ad banners.
.To keep it small, it only mutes ads on www.youtube.com/watch?* which is 99% of all YouTube videos.
*/

(function () {
  "use strict";

  const SCRIPTID = 'YouTubeAdM\\te';
  console.log(SCRIPTID, location.href);

  let active = true;
  let userRate;
  let videoRate = true;
  let count = 1;

  function playerPage() {
    // guard function, functions -below- only work on www.youtube.com/watch?*
    if (window.location.href[29] === "?") return true;
    else return false;
  }
  function adFound() {
    // check youtube video for ad
    if (playerPage() && document.getElementsByClassName("html5-video-player")[0].className.indexOf("ad-interrupting") !== -1) return true;
    else return false;
  }
  function clickMute() {
    // click youtube player mute button
    if (playerPage()) document.getElementsByClassName("ytp-mute-button ytp-button")[0].click();
    else return null;
  }
  function adjustSpeed(rate=1.00) {
    // set youtube video player speed
    if (playerPage()) document.getElementsByClassName("video-stream")[0].playbackRate = rate;
    else return null;
  }
  function closeBanner() {
    // close youtube ad banner
    if (playerPage() && document.getElementsByClassName("ytp-ad-overlay-close-button")[0]) document.getElementsByClassName("ytp-ad-overlay-close-button")[0].click();
    else return null;
  }
  function skipAd() {
    // skip youtube ad video after 45 sec
    if (playerPage() && document.getElementsByClassName("ytp-ad-skip-button ytp-button")[0] &&
       document.getElementsByTagName("video")[0].currentTime > 45) document.getElementsByClassName("ytp-ad-skip-button ytp-button")[0].click();
    else return null;
  }
  function musicOn() {
    // check youtube player mute state
    if (playerPage() && document.getElementsByClassName("ytp-volume-slider-handle")[0].style.left !== "0px") return true;
    else return false;
  }
  function adSpeed() {
    // check youtube ad video speed
    if (playerPage() && document.getElementsByClassName("video-stream")[0] && document.getElementsByClassName("video-stream")[0].playbackRate === 2.99) return true;
    else return false;
  }
  function videoSpeed() {
    // check youtube video speed
    if ((playerPage()) && document.getElementsByClassName("video-stream")[0]) return document.getElementsByClassName("video-stream")[0].playbackRate;
    else return null;
  }


  function mutor() {
    // guard youtube video from ads

    if (active && adFound()) {
      // activate mute if ad found
      clickMute();
      if (musicOn()) clickMute();
      active = false;
    }else if (!active && !adFound()) {
      // deactivate mute if no ad found
      if (!musicOn()) clickMute();
	    videoRate = true;
      active = true;
    }
    // adjust youtube ad video speed to 2.99x
    if (!active && !musicOn() && !adSpeed()) adjustSpeed(2.99);
    // adjust youtube ad video speed to normal if music is on
    else if (!active && musicOn() && adSpeed()) adjustSpeed(userRate);
    if (videoRate && adSpeed() && userRate !== 2.99) {
      // adjust youtube ad video speed to normal if no ad
	    adjustSpeed(userRate);
	    videoRate = false;
    }
    if (userRate !== videoSpeed() && !adSpeed()) {
      // check user video speed choice
      userRate = videoSpeed();
      adjustSpeed(userRate);
    }
    count++
    if (!(count%3)) {
      // check for ad banner every ~3 sec
      count = 1;
      if (active) closeBanner();
    }
    // check for long ad
    if (!active) skipAd();
  }
  // start youtube video check for ads
  setInterval(mutor, 900);
}());
