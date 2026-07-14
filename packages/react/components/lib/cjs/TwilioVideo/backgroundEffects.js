"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundEffectController = exports.loadBackgroundImage = exports.writeEffectPreference = exports.readEffectPreference = exports.loadTwilioVideoProcessorsModule = exports.BLUR_BACKGROUND_STORAGE_KEY = exports.BACKGROUND_EFFECT_STORAGE_KEY = exports.BLUR_BACKGROUND_ASSETS_PATH = void 0;
exports.BLUR_BACKGROUND_ASSETS_PATH = '/twilio-video-processors';
// Current (three-state) preference key
exports.BACKGROUND_EFFECT_STORAGE_KEY = 'tellescope.twilio.backgroundEffect';
// Legacy boolean blur preference key, kept for backward-compatible migration
exports.BLUR_BACKGROUND_STORAGE_KEY = 'tellescope.twilio.blurBackground';
var videoProcessorsModulePromise = null;
var loadTwilioVideoProcessorsModule = function () {
    if (!videoProcessorsModulePromise) {
        videoProcessorsModulePromise = Promise.resolve().then(function () { return __importStar(require('@twilio/video-processors')); });
    }
    return videoProcessorsModulePromise;
};
exports.loadTwilioVideoProcessorsModule = loadTwilioVideoProcessorsModule;
/**
 * Reads the persisted background-effect preference, migrating the legacy
 * boolean blur preference (`tellescope.twilio.blurBackground === 'true'`) to
 * the new 'blur' value on first read.
 */
var readEffectPreference = function () {
    try {
        if (typeof localStorage === 'undefined')
            return 'none';
        var stored = localStorage.getItem(exports.BACKGROUND_EFFECT_STORAGE_KEY);
        if (stored === 'none' || stored === 'blur' || stored === 'image')
            return stored;
        // Migrate legacy boolean blur preference for backward compatibility
        if (localStorage.getItem(exports.BLUR_BACKGROUND_STORAGE_KEY) === 'true') {
            localStorage.setItem(exports.BACKGROUND_EFFECT_STORAGE_KEY, 'blur');
            return 'blur';
        }
        return 'none';
    }
    catch (_a) {
        return 'none';
    }
};
exports.readEffectPreference = readEffectPreference;
var writeEffectPreference = function (effect) {
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(exports.BACKGROUND_EFFECT_STORAGE_KEY, effect);
        }
    }
    catch ( /* ignore */_a) { /* ignore */ }
};
exports.writeEffectPreference = writeEffectPreference;
/**
 * Loads an image for compositing as a virtual background. The image is fetched
 * with `crossOrigin = 'anonymous'` so the resulting canvas is not tainted
 * (the file is served from the public S3 bucket, which the Chime path already
 * relies on for CORS).
 */
var loadBackgroundImage = function (url) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () { return resolve(img); };
        img.onerror = function () { return reject(new Error("Failed to load background image: ".concat(url))); };
        img.src = url;
    });
};
exports.loadBackgroundImage = loadBackgroundImage;
/**
 * Centralizes the attach/detach lifecycle for Twilio video background
 * processors so the in-call context and the pre-join preview don't have to
 * duplicate near-identical logic. Only one processor can be attached to a
 * track at a time, so switching effects tears down the previous processor.
 */
var BackgroundEffectController = /** @class */ (function () {
    function BackgroundEffectController() {
        this.processor = null;
        this.processorEffect = 'none';
        this.attachedTrack = null;
        // Last-call-wins guard against overlapping async apply() invocations
        this.applyToken = 0;
    }
    BackgroundEffectController.prototype.detachFromTrack = function () {
        if (this.attachedTrack && this.processor) {
            try {
                this.attachedTrack.removeProcessor(this.processor);
            }
            catch ( /* ignore */_a) { /* ignore */ }
        }
        this.attachedTrack = null;
    };
    BackgroundEffectController.prototype.dropProcessor = function () {
        this.detachFromTrack();
        this.processor = null;
        this.processorEffect = 'none';
    };
    /**
     * Reconciles the given track/effect with the currently-attached processor.
     * Building a processor and loading its model is async; if a newer apply()
     * call supersedes this one mid-flight, this call bails out to avoid
     * double-attaching.
     */
    BackgroundEffectController.prototype.apply = function (track, effect, imageEl) {
        return __awaiter(this, void 0, void 0, function () {
            var token, isStale, mod, processor;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = ++this.applyToken;
                        isStale = function () { return token !== _this.applyToken; };
                        // Detach from a previously-attached track if it differs from the current one
                        if (this.attachedTrack && this.attachedTrack !== track) {
                            this.detachFromTrack();
                        }
                        // Nothing to attach to, or effect disabled, or image effect without an image
                        if (!track || effect === 'none' || (effect === 'image' && !imageEl)) {
                            this.detachFromTrack();
                            return [2 /*return*/];
                        }
                        // If a different effect is active, tear down the old processor first
                        if (this.processor && this.processorEffect !== effect) {
                            this.dropProcessor();
                        }
                        if (!!this.processor) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, exports.loadTwilioVideoProcessorsModule)()];
                    case 1:
                        mod = _a.sent();
                        if (isStale())
                            return [2 /*return*/];
                        processor = void 0;
                        if (effect === 'blur') {
                            processor = new mod.GaussianBlurBackgroundProcessor({
                                assetsPath: exports.BLUR_BACKGROUND_ASSETS_PATH,
                            });
                        }
                        else {
                            processor = new mod.VirtualBackgroundProcessor({
                                assetsPath: exports.BLUR_BACKGROUND_ASSETS_PATH,
                                backgroundImage: imageEl,
                                fitType: mod.ImageFit.Cover,
                            });
                        }
                        return [4 /*yield*/, processor.loadModel()];
                    case 2:
                        _a.sent();
                        if (isStale())
                            return [2 /*return*/];
                        this.processor = processor;
                        this.processorEffect = effect;
                        _a.label = 3;
                    case 3:
                        // Attach the processor to the track if not already attached
                        if (this.attachedTrack !== track && this.processor) {
                            track.addProcessor(this.processor, {
                                inputFrameBufferType: 'videoframe',
                                outputFrameBufferContextType: 'bitmaprenderer',
                            });
                            this.attachedTrack = track;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Detaches and discards any active processor. Use for cleanup on unmount. */
    BackgroundEffectController.prototype.detach = function () {
        this.applyToken++;
        this.dropProcessor();
    };
    return BackgroundEffectController;
}());
exports.BackgroundEffectController = BackgroundEffectController;
//# sourceMappingURL=backgroundEffects.js.map