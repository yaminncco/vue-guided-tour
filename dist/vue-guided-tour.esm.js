import { watch, unref, onScopeDispose, toRefs, ref, reactive, computed, onBeforeUpdate, nextTick, openBlock, createBlock, Teleport, createElementVNode, mergeProps, normalizeStyle, createElementBlock, Fragment, renderList, normalizeClass, createCommentVNode, renderSlot, readonly, inject, onMounted, resolveComponent, Transition, withCtx, createVNode, normalizeProps, guardReactiveProps, toDisplayString } from 'vue';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var overlayOptions = {
  allowOverlayClose: {
    type: Boolean,
    default: true
  },
  allowEscClose: {
    type: Boolean,
    default: true
  },
  allowInteraction: {
    type: Boolean,
    default: true
  }
};
var popoverOptions = {
  arrow: {
    type: Boolean,
    default: true
  },
  offset: {
    type: Number,
    default: 0
  },
  position: {
    type: String,
    default: "bottom",
    validator: function validator(value) {
      return ["top", "left", "right", "bottom"].indexOf(value) !== -1;
    }
  },
  placement: {
    type: String,
    default: "start",
    validator: function validator(value) {
      return ["start", "center", "end"].indexOf(value) !== -1;
    }
  },
  autoAdjust: {
    type: Boolean,
    default: true
  }
};
var vgtProps = _objectSpread2(_objectSpread2({
  steps: {
    type: Array,
    required: true,
    default: function _default() {
      return [];
    }
  },
  stepIndex: {
    type: Number,
    default: -1
  },
  padding: {
    type: Number,
    default: 0
  },
  useOverlay: {
    type: Boolean,
    default: true
  },
  pagination: {
    type: Boolean,
    default: true
  },
  closeBtn: {
    type: Boolean,
    default: true
  },
  allowKeyboardEvent: {
    type: Boolean,
    default: true
  }
}, popoverOptions), overlayOptions);
var overlayProps = _objectSpread2({
  rect: {
    type: Object,
    default: function _default() {
      return {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      };
    }
  }
}, overlayOptions);
var popoverProps = _objectSpread2({
  rect: {
    type: Object,
    default: function _default() {
      return {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      };
    }
  }
}, popoverOptions);

function useEvent(target, type, callback, options) {
  var eventTarget;

  var cleanup = function cleanup() {
    if (eventTarget) {
      eventTarget.removeEventListener(type, callback, options);
      eventTarget = undefined;
    }
  };

  var stopWatch = watch(function () {
    return unref(target);
  }, function (el) {
    cleanup();
    if (!el) return;
    eventTarget = el;
    el.addEventListener(type, callback, options);
  }, {
    immediate: true,
    flush: "post"
  });

  var stop = function stop() {
    stopWatch();
    cleanup();
  };

  onScopeDispose(stop);
  return stop;
}

var getBoundingWithPadding = function getBoundingWithPadding(rect) {
  var padding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return {
    top: rect.top - padding,
    right: rect.right + padding,
    bottom: rect.bottom + padding,
    left: rect.left - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2
  };
};
var isInView = function isInView(_ref) {
  var top = _ref.top,
      left = _ref.left,
      bottom = _ref.bottom,
      right = _ref.right;
  var _window = window,
      w = _window.innerWidth,
      h = _window.innerHeight;
  return top >= 0 && left >= 0 && right <= w && bottom <= h;
};
var isOutView = function isOutView(_ref2) {
  var top = _ref2.top,
      left = _ref2.left,
      bottom = _ref2.bottom,
      right = _ref2.right;
  var _window2 = window,
      w = _window2.innerWidth,
      h = _window2.innerHeight;
  return {
    top: top < 0,
    left: left < 0,
    right: right > w,
    bottom: bottom > h
  };
};
var isPositionVertical = function isPositionVertical(position) {
  return position === "top" || position === "bottom";
};
var rafThrottle = function rafThrottle(fn) {
  var rafId;
  var lastArgs;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    lastArgs = args;
    if (rafId) return;
    rafId = requestAnimationFrame(function () {
      rafId = null;
      fn.apply(void 0, _toConsumableArray(lastArgs));
    });
  };
};

var script$2 = {
  name: "VueGuidedOverlay",
  inheritAttrs: false,
  props: {
    ...overlayProps,
  },
  emits: ["overlay-click", "update:rect"],
  setup(props, { emit }) {
    const { rect, allowInteraction, allowOverlayClose, allowEscClose } =
      toRefs(props);
    const active = ref(false);
    const moving = ref(false);

    const rectDefault = { top: 0, left: 0, width: 0, height: 0 };
    const currentRect = reactive({ ...rectDefault });
    const prevRect = reactive({ ...rectDefault });

    const overlayWrapper = reactive({
      width: 0,
      height: 0,
    });
    const overlaysRef = ref([]);
    const overlayRectDefault = {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    };
    const overlaysRect = reactive(
      Object.fromEntries(
        ["top", "left", "bottom", "right", "center"].map((key) => [
          key,
          { ...overlayRectDefault },
        ])
      )
    );

    const fadeDuration = 300;
    const moveDuration = 300;
    const moveEase = "cubic-bezier(.65,.05,.36,1)";

    const overlayWrapperStyle = computed(() => {
      return {
        width: `${overlayWrapper.width}px`,
        height: `${overlayWrapper.height}px`,
        overflow: "hidden",
        position: "absolute",
        top: "0px",
        left: "0px",
        opacity: active.value ? "0.65" : "0",
        visibility: active.value ? "visible" : "hidden",
        "pointer-events": allowInteraction.value ? "none" : null,
        transition: `${fadeDuration}ms opacity, ${fadeDuration}ms visibility`,
      };
    });

    const overlaysRectStyle = computed(() => {
      return (key) => {
        const overlay = overlaysRect[key];
        if (!overlay) return null;
        const position = {
          position: "absolute",
        };
        let transformOrigin = null;

        if (key === "bottom") {
          position.bottom = "0px";
          transformOrigin = "bottom left";
        } else if (key === "right") {
          position.right = "0px";
          transformOrigin = "top right";
        } else {
          position.top = "0px";
          position.left = "0px";
          transformOrigin = "top left";
        }

        return {
          width: `${overlay.width}px`,
          height: `${overlay.height}px`,
          transform: `translate3d(${overlay.x}px, ${overlay.y}px, 0) scale3d(${overlay.scaleX}, ${overlay.scaleY}, 1)`,
          ...position,
          transformOrigin,
        };
      };
    });

    const updateRect = (rect, { top = 0, left = 0, width = 0, height = 0 }) => {
      rect.top = top;
      rect.left = left;
      rect.width = width;
      rect.height = height;
      rect.bottom = height + top;
      rect.right = width + left;
    };

    const getOverlayRect = ({ top, left, right, bottom, width, height }) => {
      const w = overlayWrapper.width;
      const h = overlayWrapper.height;
      const size = 200;

      const topOverlay = {
        width: size,
        height: size,
        x: 0,
        y: top + window.scrollY < 0 ? -size + top + window.scrollY : 0,
        scaleX: w / size,
        scaleY: top + window.scrollY < 0 ? 1 : (top + window.scrollY) / size,
      };
      const leftOverlay = {
        width: size,
        height: size,
        x: left + window.scrollX < 0 ? -size + left + window.scrollX : 0,
        y: 0,
        scaleX: left + window.scrollX < 0 ? 1 : (left + window.scrollX) / size,
        scaleY: h / size,
      };
      const rightOverlay = {
        width: size,
        height: size,
        x:
          right + window.scrollX > w
            ? -(w - (right + window.scrollX)) + size
            : 0,
        y: 0,
        scaleX:
          right + window.scrollX > w
            ? 1
            : (w - (right + window.scrollX)) / size,
        scaleY: h / size,
      };
      const bottomOverlay = {
        width: size,
        height: size,
        x: 0,
        y:
          bottom + window.scrollY > h
            ? -(h - (bottom + window.scrollY)) + size
            : 0,
        scaleX: w / size,
        scaleY:
          bottom + window.scrollY > h
            ? 1
            : (h - (bottom + window.scrollY)) / size,
      };
      const centerOverlay = {
        width,
        height,
        x: left + window.scrollX,
        y: top + window.scrollY,
        scaleX: 1,
        scaleY: 1,
      };

      return {
        top: topOverlay,
        left: leftOverlay,
        right: rightOverlay,
        bottom: bottomOverlay,
        center: centerOverlay,
      };
    };

    const updateOverlayWrapper = () => {
      const fullHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
      const fullWidth = Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.body.clientWidth,
        document.documentElement.clientWidth
      );
      overlayWrapper.width = fullWidth;
      overlayWrapper.height = fullHeight;
    };

    const resetOverlayWrapper = () => {
      overlayWrapper.width = 0;
      overlayWrapper.height = 0;
    };

    const updateOverlaysRect = () => {
      const currentOverlayRect = getOverlayRect(currentRect);
      for (const overlayKey in overlaysRect) {
        const overlay = overlaysRect[overlayKey];
        overlay.width = currentOverlayRect[overlayKey].width;
        overlay.height = currentOverlayRect[overlayKey].height;
        overlay.x = currentOverlayRect[overlayKey].x;
        overlay.y = currentOverlayRect[overlayKey].y;
        overlay.scaleX = currentOverlayRect[overlayKey].scaleX;
        overlay.scaleY = currentOverlayRect[overlayKey].scaleY;
      }
    };

    const invertOverlaysRect = () => {
      const prevOverlayRect = getOverlayRect(prevRect);
      const currentOverlayRect = getOverlayRect(currentRect);

      for (const overlayKey in overlaysRect) {
        const overlay = overlaysRect[overlayKey];
        if (overlayKey === "center") {
          overlay.x +=
            prevOverlayRect[overlayKey].x - currentOverlayRect[overlayKey].x;
          overlay.y +=
            prevOverlayRect[overlayKey].y - currentOverlayRect[overlayKey].y;
          overlay.scaleX =
            prevOverlayRect[overlayKey].width /
            currentOverlayRect[overlayKey].width;
          overlay.scaleY =
            prevOverlayRect[overlayKey].height /
            currentOverlayRect[overlayKey].height;
        } else {
          overlay.x = prevOverlayRect[overlayKey].x;
          overlay.y = prevOverlayRect[overlayKey].y;
          overlay.scaleX = prevOverlayRect[overlayKey].scaleX;
          overlay.scaleY = prevOverlayRect[overlayKey].scaleY;
        }
      }
    };

    const moveOverlaysRect = (callback = undefined) => {
      for (const overlayKey in overlaysRect) {
        overlaysRef.value[
          overlayKey
        ].style.transition = `${moveDuration}ms transform ${moveEase}`;
      }

      updateOverlaysRect();
      setTimeout(() => {
        updateRect(currentRect, rect.value);
        updateOverlaysRect();
        for (const overlayKey in overlaysRect) {
          overlaysRef.value[overlayKey].style.transition = ``;
        }
        moving.value = false;
        if (callback) {
          callback();
        }
      }, moveDuration);
    };

    const overlayUpdate = () => {
      if (!active.value || moving.value) return;
      resetOverlayWrapper();
      nextTick(() => {
        updateOverlayWrapper();
        updateRect(currentRect, rect.value);
        updateOverlaysRect();
      });
    };

    const overlayFadeIn = (callback = undefined) => {
      overlayUpdate();
      moving.value = true;
      setTimeout(() => {
        moving.value = false;
        if (callback) {
          callback();
        }
      }, fadeDuration);
    };

    const overlayFadeOut = (callback = undefined) => {
      setTimeout(() => {
        resetOverlayWrapper();
        if (callback) {
          callback();
        }
      }, fadeDuration);
    };

    const overlayMove = (callback) => {
      moving.value = true;
      resetOverlayWrapper();
      nextTick(() => {
        updateOverlayWrapper();
        updateRect(
          prevRect,
          overlaysRef.value["center"].getBoundingClientRect()
        );
        updateOverlaysRect();
        invertOverlaysRect();
        setTimeout(() => {
          moveOverlaysRect(callback);
        }, 16);
      });
    };

    const overlayStart = (callback) => {
      if (active.value) return;
      handleTargetUpdate(rect.value, callback);
    };

    const overlayClose = (callback) => {
      if (!active.value || moving.value) return;
      handleTargetUpdate(undefined, callback);
    };

    const overlayMoveTo = (newRect, callback) => {
      if (!active.value || moving.value || !newRect) return;
      emit("update:rect", newRect);
      handleTargetUpdate(newRect, callback, true);
    };

    const handleTargetUpdate = (newRect, callback, move = false) => {
      if (!newRect) {
        active.value = false;
        overlayFadeOut(callback);
        return;
      }

      updateRect(prevRect, currentRect);
      updateRect(currentRect, newRect);

      active.value = true;
      move ? overlayMove(callback) : overlayFadeIn(callback);
    };

    const onUpdate = rafThrottle(overlayUpdate);

    onBeforeUpdate(() => {
      overlaysRef.value = [];
    });

    const onOverlayClick = () => {
      if (!allowOverlayClose.value) return;
      emit("overlay-click");
      overlayClose();
    };

    const onKeyUp = (event) => {
      if (event.key !== "Escape" || !allowEscClose.value) return;
      emit("overlay-click");
      overlayClose();
    };

    watch(
      () => rect.value,
      () => {
        onUpdate();
      },
      {
        deep: true,
      }
    );
    useEvent(window, "scroll", onUpdate);
    useEvent(window, "resize", onUpdate);
    useEvent(window, "keyup", onKeyUp);

    return {
      active,
      overlaysRef,
      overlaysRect,
      overlaysRectStyle,
      overlayWrapperStyle,
      onOverlayClick,
      overlayStart,
      overlayClose,
      overlayMoveTo,
    };
  },
};

function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(Teleport, { to: "body" }, [
    createElementVNode("div", mergeProps({ class: "vue-guided-overlay" }, _ctx.$attrs), [
      createElementVNode("div", {
        class: "vgo__wrapper",
        style: normalizeStyle($setup.overlayWrapperStyle)
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($setup.overlaysRect, (overlay, key) => {
          return (openBlock(), createElementBlock("div", {
            key: key,
            ref_for: true,
            ref: 
            (el) => {
              if (el) $setup.overlaysRef[key] = el;
            }
          ,
            class: normalizeClass(`vgo__overlay vgo__overlay--${key}`),
            style: normalizeStyle($setup.overlaysRectStyle(key)),
            onClick: _cache[0] || (_cache[0] = (...args) => ($setup.onOverlayClick && $setup.onOverlayClick(...args)))
          }, null, 6 /* CLASS, STYLE */))
        }), 128 /* KEYED_FRAGMENT */))
      ], 4 /* STYLE */)
    ], 16 /* FULL_PROPS */)
  ]))
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$2 = "\n.vue-guided-overlay {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  z-index: 99990 !important;\n}\n.vgo__overlay {\r\n  background-color: #000;\r\n  pointer-events: auto;\n}\n.vgo__overlay--center {\r\n  pointer-events: none !important;\r\n  background-color: transparent !important;\n}\r\n";
styleInject(css_248z$2);

script$2.render = render$2;
script$2.__file = "src/components/vueGuidedOverlay.vue";

function useObserver(target, callback) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var observer;

  var cleanup = function cleanup() {
    if (observer) {
      observer.disconnect();
      observer = undefined;
    }
  };

  var stopWatch = watch(function () {
    return unref(target);
  }, function (el) {
    cleanup();
    if (!el) return;
    observer = new window.ResizeObserver(callback);
    observer.observe(el, options);
  }, {
    immediate: true,
    flush: "post"
  });

  var stop = function stop() {
    stopWatch();
    cleanup();
  };

  onScopeDispose(stop);
  return stop;
}

var script$1 = {
  name: "VueGuidedPopover",
  inheritAttrs: false,
  props: {
    ...popoverProps,
  },
  setup(props) {
    const popoverRef = ref(null);
    const { rect, position } = toRefs(props);
    const currentPosition = ref(position.value);
    const x = ref(0);
    const y = ref(0);

    const popoverStyle = computed(() => {
      return {
        transform: `translateX(${x.value}px) translateY(${y.value}px)`,
      };
    });

    const { arrowStyle, arrowRect, initArrowPositionCoord } = useArrow(
      props,
      x,
      y,
      popoverRef,
      currentPosition,
      rect
    );

    watch(
      () => rect.value,
      () => {
        nextTick(() => {
          initPopover();
        });
      },
      { deep: true, immediate: true }
    );

    const initPopover = () => {
      if (!popoverRef.value) return;
      adjustCurrentPosition();
      initPositionCoord();
      nextTick(() => {
        adjustPositionCoord();
        initArrowPositionCoord();
      });
    };

    useObserver(popoverRef, initPopover);

    const initPositionCoord = () => {
      const { height: popoverHeight, width: popoverWidth } =
        popoverRef.value.getBoundingClientRect();

      const position = currentPosition.value;
      const placement = props.placement;

      const offset = props.offset + arrowRect.value.height;

      let tx = 0;
      let ty = 0;

      switch (position) {
        case "bottom":
          tx = rect.value.left;
          ty = rect.value.height + rect.value.top + offset;
          break;

        case "top":
          tx = rect.value.left;
          ty = rect.value.top - popoverHeight - offset;
          break;

        case "right":
          tx = rect.value.width + rect.value.left + offset;
          ty = rect.value.top;
          break;

        case "left":
          tx = rect.value.left - popoverWidth - offset;
          ty = rect.value.top;
          break;
      }

      switch (placement) {
        case "end":
          isPositionVertical(position)
            ? (tx = tx - popoverWidth + rect.value.width)
            : (ty = ty - popoverHeight + rect.value.height);
          break;

        case "center":
          isPositionVertical(position)
            ? (tx = tx - popoverWidth / 2 + rect.value.width / 2)
            : (ty = ty - popoverHeight / 2 + rect.value.height / 2);
          break;
      }

      x.value = tx;
      y.value = ty;
    };

    const adjustCurrentPosition = () => {
      if (!props.autoAdjust) return;
      if (checkAvailableSpace(props.position)) {
        currentPosition.value = props.position;
      } else {
        if (checkAvailableSpace(currentPosition.value)) return;
        const bestPosition = getBestPosition();
        currentPosition.value = bestPosition;
      }
    };

    const adjustPositionCoord = () => {
      if (!props.autoAdjust) return;
      const { innerWidth: w, innerHeight: h } = window;

      const popoverRect = popoverRef.value.getBoundingClientRect();
      const isPopoverOutView = isOutView(popoverRect);

      const outOffset = arrowRect.value.height + arrowRect.value.offset;
      const hTop = rect.value.top + outOffset;
      const hBottom = rect.value.height + rect.value.top - outOffset;
      const hLeft = rect.value.left + outOffset;
      const hRight = rect.value.width + rect.value.left - outOffset;

      const hIsOutView = isOutView({
        top: hBottom,
        bottom: hTop,
        left: hRight,
        right: hLeft,
      });
      const hIsOutX = hIsOutView.left || hIsOutView.right;
      const hIsOutY = hIsOutView.top || hIsOutView.bottom;

      if (isPositionVertical(currentPosition.value)) {
        if (isPopoverOutView.left) {
          x.value = !hIsOutX ? 0 : hRight;
        } else if (isPopoverOutView.right) {
          x.value = !hIsOutX
            ? w - popoverRect.width
            : -popoverRect.width + hLeft;
        }
      } else {
        if (isPopoverOutView.top) {
          y.value = !hIsOutY ? 0 : hBottom;
        } else if (isPopoverOutView.bottom) {
          y.value = !hIsOutY
            ? h - popoverRect.height
            : -popoverRect.height + hTop;
        }
      }
    };

    const checkAvailableSpace = (position) => {
      const size = getSpaceSize()[position];
      const { height: popoverHeight, width: popoverWidth } =
        popoverRef.value.getBoundingClientRect();
      const popoverSize = isPositionVertical(position)
        ? popoverHeight
        : popoverWidth;
      const offset = props.offset + arrowRect.value.height;
      return size >= popoverSize + offset;
    };

    const getSpaceSize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      return {
        bottom: h - (rect.value.height + rect.value.top),
        top: rect.value.top,
        right: w - (rect.value.width + rect.value.left),
        left: rect.value.left,
      };
    };

    const getBestPosition = () => {
      const positions = getSpaceSize();
      return Object.keys(positions).sort((a, b) => {
        if (checkAvailableSpace(a)) {
          return -1;
        }
        if (checkAvailableSpace(b)) {
          return 1;
        }
        return positions[b] - positions[a];
      })[0];
    };

    return {
      rect,
      popoverRef,
      currentPosition,
      popoverStyle,
      arrowStyle,
    };
  },
};

function useArrow(props, popoverX, popoverY, popoverRef, position, rect) {
  const x = ref(0);
  const y = ref(0);

  const size = 14;
  const height = (Math.sqrt(2) * size) / 2;
  const offset = 6; // border-radius

  const arrowRect = computed(() => {
    return {
      size: props.arrow ? size : 0,
      height: props.arrow ? height : 0,
      offset: props.arrow ? offset : 0,
    };
  });

  const arrowStyle = computed(() => {
    return {
      width: `${arrowRect.value.size}px`,
      height: `${arrowRect.value.size}px`,
      left: isPositionVertical(position.value) ? `0px` : null,
      top: !isPositionVertical(position.value) ? `0px` : null,
      [position.value]: "100%",
      transform: `translateX(${x.value}px) translateY(${y.value}px) rotate(45deg)`,
    };
  });

  const initArrowPositionCoord = () => {
    if (!props.arrow) return;
    const { height: popoverHeight, width: popoverWidth } =
      popoverRef.value.getBoundingClientRect();
    const placement = props.placement;

    const radiusOffset = arrowRect.value.offset;
    const rotateOffset =
      (2 * arrowRect.value.height - arrowRect.value.size) / 2;
    const offset = rotateOffset + radiusOffset;

    let tx = 0;
    let ty = 0;

    if (isPositionVertical(position.value)) {
      ty =
        position.value === "bottom"
          ? arrowRect.value.size / 2
          : -(arrowRect.value.size / 2);
    } else {
      tx =
        position.value === "right"
          ? arrowRect.value.size / 2
          : -(arrowRect.value.size / 2);
    }
    switch (placement) {
      case "center":
        isPositionVertical(position.value)
          ? (tx =
              rect.value.left -
              popoverX.value +
              rect.value.width / 2 -
              arrowRect.value.size / 2)
          : (ty =
              rect.value.top -
              popoverY.value +
              rect.value.height / 2 -
              arrowRect.value.size / 2);
        break;
      case "start":
        isPositionVertical(position.value)
          ? (tx = rect.value.left - popoverX.value + offset)
          : (ty = rect.value.top - popoverY.value + offset);
        break;
      case "end":
        isPositionVertical(position.value)
          ? (tx =
              rect.value.width +
              rect.value.left -
              popoverX.value -
              arrowRect.value.size -
              offset)
          : (ty =
              rect.value.height +
              rect.value.top -
              popoverY.value -
              arrowRect.value.size -
              offset);
        break;
    }

    const tMin = offset;
    const tMax = (length) => length - arrowRect.value.height * 2 + offset;
    const txMax = tMax(popoverWidth);
    const tyMax = tMax(popoverHeight);
    if (isPositionVertical(position.value)) {
      if (tx > txMax) {
        tx = txMax;
      } else if (tx < tMin) {
        tx = tMin;
      }
    } else {
      if (ty > tyMax) {
        ty = tyMax;
      } else if (ty < tMin) {
        ty = tMin;
      }
    }

    x.value = tx;
    y.value = ty;
  };

  return {
    arrowStyle,
    arrowRect,
    initArrowPositionCoord,
  };
}

const _hoisted_1$1 = { class: "vgp__body" };

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", mergeProps({
    ref: "popoverRef",
    class: "vue-guided-popover",
    style: $setup.popoverStyle
  }, _ctx.$attrs), [
    (_ctx.arrow)
      ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(`vgp__arrow vgp__arrow--${$setup.currentPosition}`),
          style: normalizeStyle($setup.arrowStyle)
        }, null, 6 /* CLASS, STYLE */))
      : createCommentVNode("v-if", true),
    createElementVNode("div", _hoisted_1$1, [
      renderSlot(_ctx.$slots, "default")
    ])
  ], 16 /* FULL_PROPS */))
}

var css_248z$1 = "\n.vue-guided-popover {\r\n  position: fixed;\r\n  top: 0;\r\n  left: 0;\r\n  min-width: 250px;\r\n  max-width: 300px;\r\n  -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);\r\n          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);\r\n  z-index: 99999 !important;\n}\n.vue-guided-popover,\r\n.vgp__body,\r\n.vgp__arrow {\r\n  background: #fff;\n}\n.vue-guided-popover,\r\n.vgp__body {\r\n  border-radius: 6px;\n}\n.vgp__body {\r\n  position: relative;\r\n  padding: 15px;\n}\n.vgp__arrow {\r\n  position: absolute;\r\n  -webkit-box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.2);\r\n          box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.2);\n}\r\n";
styleInject(css_248z$1);

script$1.render = render$1;
script$1.__file = "src/components/vueGuidedPopover.vue";

function useRect(target) {
  var rect = reactive({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    bottom: 0,
    right: 0
  });

  var update = function update() {
    var el = unref(target);

    if (!el) {
      setRect({});
      return;
    }

    setRect(el.getBoundingClientRect());

    function setRect(_ref) {
      var _ref$top = _ref.top,
          top = _ref$top === void 0 ? 0 : _ref$top,
          _ref$left = _ref.left,
          left = _ref$left === void 0 ? 0 : _ref$left,
          _ref$width = _ref.width,
          width = _ref$width === void 0 ? 0 : _ref$width,
          _ref$height = _ref.height,
          height = _ref$height === void 0 ? 0 : _ref$height;
      rect.top = top;
      rect.left = left;
      rect.width = width;
      rect.height = height;
      rect.bottom = height + top;
      rect.right = width + left;
    }
  };

  var rafUpdate = rafThrottle(update);
  watch(function () {
    return unref(target);
  }, function () {
    update();
  }, {
    immediate: true
  });
  useEvent(window, "resize", rafUpdate);
  useEvent(window, "scroll", rafUpdate);
  useObserver(target, rafUpdate);
  return {
    rect: rect
  };
}

function useFocusTrap(target) {
  var active = ref(false);
  var focusableEls = ref([]);

  var onKeyDown = function onKeyDown(event) {
    if (!active.value || !unref(target)) return;
    var isTabPressed = event.key === "Tab" || event.keyCode === 9;
    if (!isTabPressed) return;

    if (focusableEls.value.length === 0) {
      event.preventDefault();
    } else {
      var firstFocusableEl = focusableEls.value[0];
      var lastFocusableEl = focusableEls.value[focusableEls.value.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstFocusableEl) {
          lastFocusableEl.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableEl) {
          firstFocusableEl.focus();
          event.preventDefault();
        }
      }
    }
  };

  var enableTrap = function enableTrap() {
    active.value = true;
    focusableEls.value = getFocusableElements(unref(target));

    if (focusableEls.value.length > 0) {
      var firstFocusableEl = focusableEls.value[0];
      firstFocusableEl.focus();
    }
  };

  var disableTrap = function disableTrap() {
    active.value = false;
  };

  useEvent(target, "keydown", onKeyDown);
  return {
    active: readonly(active),
    enableTrap: enableTrap,
    disableTrap: disableTrap
  };
}

function getFocusableElements(target) {
  if (!target) return;
  var selector = "button, [href], input, select, textarea, [tabindex]";

  var focusableEls = _toConsumableArray(target.querySelectorAll(selector)).filter(function (el) {
    if (parseInt(el.getAttribute("tabindex"), 10) < 0) {
      return false;
    }

    if (el.disabled) {
      return false;
    }

    while (el) {
      if (getComputedStyle(el).display === "none" || getComputedStyle(el).visibility === "hidden") {
        return false;
      }

      el = el.parentElement;
    }

    return true;
  });

  return focusableEls;
}

var script = {
  name: "VueGuidedTour",
  components: {
    "vgt-overlay": script$2,
    "vgt-popover": script$1,
  },
  inheritAttrs: false,
  props: {
    ...vgtProps,
  },
  emits: ["update:stepIndex", "afterStart", "afterEnd", "afterMove"],
  setup(props, { emit }) {
    const { stepIndex, steps, allowKeyboardEvent, useOverlay } = toRefs(props);
    const vgtRef = ref(null);
    const vgtOverlay = ref(null);

    const $vgt = inject("$vgt", {});
    const uid = Math.random().toString(36).substring(2);

    const showPopover = ref(false);

    const currentStepIndex = ref(-1);
    currentStepIndex.value = stepIndex.value;

    const currentStepEl = ref(null);
    const prevEl = ref(null);

    const active = ref(false);
    const moving = ref(false);

    const { enableTrap } = useFocusTrap(vgtRef);
    let lastFocused;

    const { getHighlightEl, addHighlight, removeHighlight } = useHightlight();

    const { rect } = useRect(currentStepEl);
    const currentStepRect = computed(() => {
      const padding = currentStep.value.padding || props.padding;
      return getBoundingWithPadding(rect, padding);
    });

    const currentStep = computed(() => {
      if (currentStepIndex.value < 0) return {};
      const stepObj = steps.value[currentStepIndex.value];
      if (!stepObj) return {};
      return {
        ...stepObj,
        // popover options
        popover: {
          ...stepObj.popover,
          role: "dialog",
          id: stepObj.popover?.id || `popover-${uid}`,
          "aria-labelledby": stepObj.title
            ? `${stepObj.popover?.id || uid}-title`
            : null,
          "aria-describedby": stepObj.content
            ? `${stepObj.popover?.id || uid}-desc`
            : null,
        },
        // overlay options
        overlay: {
          ...stepObj.overlay,
        },
      };
    });
    const isFirstStep = computed(() => {
      return currentStepIndex.value === 0;
    });
    const isLastStep = computed(() => {
      return currentStepIndex.value === steps.value.length - 1;
    });

    onMounted(() => {
      $vgt.start = onStart;
      $vgt.next = onNext;
      $vgt.prev = onPrev;
      $vgt.end = onEnd;
      $vgt.move = onMove;
    });

    const onStart = (index = 0) => {
      if (active.value) return;
      handleStepIndexChange(index);
    };

    const onNext = () => {
      if (!active.value || moving.value) return;
      const index = currentStepIndex.value + 1;
      if (index > steps.value.length - 1) return;
      handleStepIndexChange(index);
    };

    const onPrev = () => {
      if (!active.value || moving.value) return;
      const index = currentStepIndex.value - 1;
      if (index < 0) return;
      handleStepIndexChange(index);
    };

    const onEnd = () => {
      if (!active.value || moving.value) return;
      const index = -1;
      handleStepIndexChange(index);
    };

    const onMove = (index = 0) => {
      if (index === currentStepIndex.value || !active.value || moving.value)
        return;
      handleStepIndexChange(index);
    };

    const handleStepIndexChange = (index) => {
      if (index < -1 || index > steps.value.length - 1) return;
      if (index === currentStepIndex.value) return;

      const el = getHighlightEl(index, steps.value);
      if (!el && index !== -1) return;

      showPopover.value = false;
      removeHighlight();

      updateCurrentStep(index, el);

      if (index === -1) {
        handleEndTour();
        return;
      }
      handleMoveTour();
    };

    const handleMoveTour = () => {
      const el = currentStepEl.value;
      const move = !!prevEl.value;

      active.value = true;
      moving.value = true;

      if (useOverlay.value) {
        const startTour = () => {
          lastFocused = document.activeElement;
          vgtOverlay.value.overlayStart(done);
        };

        const moveTour = () => {
          const padding = currentStep.value.padding || props.padding;
          const newRect = getBoundingWithPadding(
            currentStepEl.value.getBoundingClientRect(),
            padding
          );
          vgtOverlay.value.overlayMoveTo(newRect, done);
        };

        move ? moveTour() : startTour();
      } else {
        nextTick(() => {
          done();
        });
      }

      function done() {
        const inView = isInView(el.getBoundingClientRect());
        if (!inView) {
          el.scrollIntoView({ block: "center" });
        }
        showPopover.value = true;
        addHighlight(currentStepEl.value);
        moving.value = false;
        nextTick(() => {
          enableTrap();
        });
        emit(!move ? "afterStart" : "afterMove");
      }
    };

    const handleEndTour = () => {
      showPopover.value = false;
      removeHighlight();
      if (useOverlay.value) {
        endTour();
      } else {
        done();
      }

      function endTour() {
        vgtOverlay.value.overlayClose(done);
      }

      function done() {
        active.value = false;
        moving.value = false;
        lastFocused.focus({
          preventScroll: true,
        });
        emit("afterEnd");
      }
    };

    const updateCurrentStep = (index = -1, el) => {
      currentStepIndex.value = index;
      emit("update:stepIndex", currentStepIndex.value);

      if (index === -1) {
        prevEl.value = null;
        currentStepEl.value = null;
      } else {
        prevEl.value = currentStepEl.value;
        currentStepEl.value = el;
      }
    };

    const onKeyUp = (event) => {
      if (!active.value || !allowKeyboardEvent.value) return;
      switch (event.key) {
        case "ArrowLeft":
          onPrev();
          break;
        case "ArrowRight":
          onNext();
          break;
      }
    };

    const onOverlayClick = () => {
      onEnd();
    };

    const onCloseClick = () => {
      onEnd();
    };

    useEvent(window, "keyup", onKeyUp);

    return {
      vgtRef,
      vgtOverlay,
      active,
      showPopover,
      currentStepIndex,
      currentStepRect,
      currentStep,
      isFirstStep,
      isLastStep,
      start: onStart,
      next: onNext,
      prev: onPrev,
      end: onEnd,
      move: onMove,
      onOverlayClick,
      onCloseClick,
    };
  },
};

function useHightlight() {
  const highlightClass = "vgt__target--highlighted";

  const getHighlightEl = (index, steps) => {
    if (typeof index !== "number" || index < 0 || index > steps.length - 1)
      return;
    const targetValue = steps[index].target;
    const el = document.querySelector(`${targetValue}`);
    if (!targetValue) {
      console.warn(`[vue-guided-tour] : Target is required in step ${index}`);
      return undefined;
    } else if (!el) {
      console.warn(
        `[vue-guided-tour] : Target to highlight "${targetValue}" not found`
      );
      return undefined;
    }
    return el;
  };

  const addHighlight = (el) => {
    el.classList.add(highlightClass);
  };

  const removeHighlight = () => {
    const allTargets = document.querySelectorAll(`.${highlightClass}`);
    allTargets.forEach((target) => {
      target.classList.remove(highlightClass);
    });
  };

  return {
    getHighlightEl,
    addHighlight,
    removeHighlight,
  };
}

const _hoisted_1 = { class: "vgt__body" };
const _hoisted_2 = ["id"];
const _hoisted_3 = ["id"];
const _hoisted_4 = { class: "vgt__footer" };
const _hoisted_5 = {
  key: 0,
  class: "vgt__pages"
};
const _hoisted_6 = { class: "vgt__nav" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_vgt_overlay = resolveComponent("vgt-overlay");
  const _component_vgt_popover = resolveComponent("vgt-popover");

  return (openBlock(), createBlock(Teleport, { to: "body" }, [
    createElementVNode("div", mergeProps({
      ref: "vgtRef",
      class: "vue-guided-tour"
    }, _ctx.$attrs), [
      (_ctx.useOverlay)
        ? (openBlock(), createBlock(_component_vgt_overlay, mergeProps({
            key: 0,
            ref: "vgtOverlay",
            rect: $setup.currentStepRect,
            "allow-overlay-close": _ctx.allowOverlayClose,
            "allow-esc-close": _ctx.allowEscClose,
            "allow-interaction": _ctx.allowInteraction
          }, { ...$setup.currentStep.overlay }, { onOverlayClick: $setup.onOverlayClick }), null, 16 /* FULL_PROPS */, ["rect", "allow-overlay-close", "allow-esc-close", "allow-interaction", "onOverlayClick"]))
        : createCommentVNode("v-if", true),
      (
          $setup.showPopover &&
            ($setup.currentStep.title || $setup.currentStep.content || _ctx.$slots.content)
        )
        ? (openBlock(), createBlock(Transition, {
            key: 1,
            name: "popover-appear",
            appear: ""
          }, {
            default: withCtx(() => [
              createVNode(_component_vgt_popover, mergeProps({
                rect: $setup.currentStepRect,
                arrow: _ctx.arrow,
                offset: _ctx.offset,
                position: _ctx.position,
                placement: _ctx.placement,
                "auto-adjust": _ctx.autoAdjust
              }, { ...$setup.currentStep.popover }), {
                default: withCtx(() => [
                  (_ctx.closeBtn)
                    ? renderSlot(_ctx.$slots, "close", { key: 0 }, () => [
                        createElementVNode("button", {
                          class: "vgt__close-btn",
                          "aria-label": "close Tour",
                          onClick: _cache[0] || (_cache[0] = (...args) => ($setup.onCloseClick && $setup.onCloseClick(...args)))
                        }, " × ")
                      ])
                    : createCommentVNode("v-if", true),
                  createElementVNode("div", _hoisted_1, [
                    renderSlot(_ctx.$slots, "content", normalizeProps(guardReactiveProps({ stepIndex: $setup.currentStepIndex })), () => [
                      ($setup.currentStep.title)
                        ? (openBlock(), createElementBlock("h3", {
                            key: 0,
                            id: $setup.currentStep.popover['aria-labelledby'],
                            class: "vgt__title"
                          }, toDisplayString($setup.currentStep.title), 9 /* TEXT, PROPS */, _hoisted_2))
                        : createCommentVNode("v-if", true),
                      ($setup.currentStep.content)
                        ? (openBlock(), createElementBlock("div", {
                            key: 1,
                            id: $setup.currentStep.popover['aria-describedby'],
                            class: "vgt__content"
                          }, toDisplayString($setup.currentStep.content), 9 /* TEXT, PROPS */, _hoisted_3))
                        : createCommentVNode("v-if", true)
                    ])
                  ]),
                  createElementVNode("div", _hoisted_4, [
                    (_ctx.pagination)
                      ? (openBlock(), createElementBlock("div", _hoisted_5, toDisplayString($setup.currentStepIndex + 1) + " / " + toDisplayString(_ctx.steps.length), 1 /* TEXT */))
                      : createCommentVNode("v-if", true),
                    renderSlot(_ctx.$slots, "nav", normalizeProps(guardReactiveProps({ isFirstStep: $setup.isFirstStep, isLastStep: $setup.isLastStep })), () => [
                      createElementVNode("div", _hoisted_6, [
                        (!$setup.isFirstStep)
                          ? (openBlock(), createElementBlock("button", {
                              key: 0,
                              class: "vgt__btn vgt__btn--secondary vgt__prev-btn",
                              onClick: _cache[1] || (_cache[1] = (...args) => ($setup.prev && $setup.prev(...args)))
                            }, " Prev "))
                          : createCommentVNode("v-if", true),
                        ($setup.isLastStep)
                          ? (openBlock(), createElementBlock("button", {
                              key: 1,
                              class: "vgt__btn vgt__btn--primary vgt__end-btn",
                              onClick: _cache[2] || (_cache[2] = (...args) => ($setup.end && $setup.end(...args)))
                            }, " End "))
                          : (openBlock(), createElementBlock("button", {
                              key: 2,
                              class: "vgt__btn vgt__btn--primary vgt__next-btn",
                              onClick: _cache[3] || (_cache[3] = (...args) => ($setup.next && $setup.next(...args)))
                            }, " Next "))
                      ])
                    ])
                  ])
                ]),
                _: 3 /* FORWARDED */
              }, 16 /* FULL_PROPS */, ["rect", "arrow", "offset", "position", "placement", "auto-adjust"])
            ]),
            _: 3 /* FORWARDED */
          }))
        : createCommentVNode("v-if", true)
    ], 16 /* FULL_PROPS */)
  ]))
}

var css_248z = "\n.vue-guided-tour {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  z-index: 99999 !important;\n}\r\n\r\n/*\r\n.vgt__target--highlighted {\r\n}\r\n*/\n.vgt__body {\r\n  line-height: 1.5;\r\n  margin-top: 30px;\r\n  margin-bottom: 20px;\n}\n.vgt__title {\r\n  font-size: 1.4rem;\r\n  margin-top: 0;\r\n  margin-bottom: 10px;\n}\n.vgt__content {\r\n  font-size: 1rem;\r\n  margin: 0;\n}\n.vgt__footer {\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\n}\n.vgt__pages {\r\n  font-size: 0.76rem;\r\n  font-weight: 500;\r\n  color: #969faf;\n}\n.vgt__nav {\r\n  margin-left: auto;\n}\n.vgt__btn {\r\n  display: inline-block;\r\n  padding: 5px 16px;\r\n  font-family: inherit;\r\n  font-size: 0.8rem;\r\n  font-weight: 500;\r\n  line-height: 20px;\r\n  cursor: pointer;\r\n  text-decoration: none;\r\n  border-radius: 4px;\r\n  -webkit-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n  border: none;\r\n  -webkit-transition: background-color 0.1s ease, color 0.1s ease;\r\n  transition: background-color 0.1s ease, color 0.1s ease;\n}\n.vgt__btn--primary {\r\n  background-color: #3eaf7c;\r\n  color: #fff;\n}\n.vgt__btn--primary:hover {\r\n  background-color: #4abf8a;\n}\n.vgt__btn--secondary {\r\n  background-color: transparent;\r\n  color: #969faf;\n}\n.vgt__btn--secondary:hover {\r\n  color: #5b6474;\n}\n.vgt__prev-btn {\r\n  margin-right: 7px;\n}\r\n/*\r\n.vgt__next-btn {}\r\n.vgt__end-btn {}\r\n*/\n.vgt__close-btn {\r\n  position: absolute;\r\n  top: 0;\r\n  right: 0;\r\n  border: none;\r\n  background-color: transparent;\r\n  cursor: pointer;\r\n  font-family: Arial, Helvetica, sans-serif;\r\n  font-size: 0.8rem;\r\n  font-weight: 700;\r\n  height: 36px;\r\n  line-height: 36px;\r\n  width: 36px;\r\n  padding: 0;\r\n  margin: 0;\r\n  color: #969faf;\r\n  -webkit-transition: color 0.1s ease;\r\n  transition: color 0.1s ease;\n}\n.vgt__close-btn:hover {\r\n  color: #5b6474;\n}\n.popover-appear-enter-active {\r\n  -webkit-transition: opacity 0.2s ease-out;\r\n  transition: opacity 0.2s ease-out;\n}\n.popover-appear-enter-from {\r\n  opacity: 0;\n}\r\n";
styleInject(css_248z);

script.render = render;
script.__file = "src/components/vueGuidedTour.vue";

var vgtPlugin = {
  install: function install(app) {
    var $vgt = {};
    app.config.globalProperties.$vgt = $vgt;
    app.provide("$vgt", $vgt);
    app.component("VueGuidedTour", script);
  }
};

export { script$2 as VueGuidedOverlay, script$1 as VueGuidedPopover, script as VueGuidedTour, vgtPlugin as default, useRect };
