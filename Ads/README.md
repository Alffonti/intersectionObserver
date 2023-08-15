# Advertisement Visibility Tracker

This repository focuses on effectively monitoring advertisements within a blog by utilizing the Intersection Observer API. The observer's callback function is triggered immediately upon executing the line of code `adObserver.observe(adBox)` to evaluate whether the `adBox` is intersecting with the viewport of the user's device.

A threshold of 0.7 has been incorporated to activate the observer's callback function. This implies that an advertisement is deemed visible, marking the commencement of the total view time counter, when at least 75% of the advertisement becomes visible on the screen.

An interval mechanism has been introduced for educational purposes, facilitating the periodic update of advertisement timers.

To ensure accuracy, the `visibilitychange` event has been harnessed to halt the interval from updating the total view time of visible advertisements. This event is triggered each time a user switches between tabs.

The replacement of an advertisement is implemented once the accumulated view time surpasses 1 minute. However, an advertisement is substituted only if it is no longer visible on the screen.

## Reference

For more details on the Intersection Observer API and its role in tracking the visibility of elements, refer to the following link:
[MDN Web Docs - Intersection Observer API: Timing Element Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API/Timing_element_visibility)
