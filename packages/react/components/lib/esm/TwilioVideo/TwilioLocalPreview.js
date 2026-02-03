var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import Video from 'twilio-video';
import { Box, Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
export var TwilioLocalPreview = function (_a) {
    var style = _a.style;
    var containerRef = useRef(null);
    var trackRef = useRef(null);
    var _b = useState(null), error = _b[0], setError = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState([]), devices = _d[0], setDevices = _d[1];
    var _e = useState(''), selectedDeviceId = _e[0], setSelectedDeviceId = _e[1];
    // Enumerate video devices
    useEffect(function () {
        var getDevices = function () { return __awaiter(void 0, void 0, void 0, function () {
            var stream, allDevices, videoDevices, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ video: true })];
                    case 1:
                        stream = _a.sent();
                        stream.getTracks().forEach(function (track) { return track.stop(); });
                        return [4 /*yield*/, navigator.mediaDevices.enumerateDevices()];
                    case 2:
                        allDevices = _a.sent();
                        videoDevices = allDevices.filter(function (d) { return d.kind === 'videoinput'; });
                        setDevices(videoDevices);
                        if (videoDevices.length > 0 && !selectedDeviceId) {
                            setSelectedDeviceId(videoDevices[0].deviceId);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        setError((err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || 'Failed to enumerate devices');
                        setLoading(false);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        getDevices();
    }, []);
    // Create video track when device is selected
    useEffect(function () {
        if (!selectedDeviceId)
            return;
        var mounted = true;
        var getVideoTrack = function () { return __awaiter(void 0, void 0, void 0, function () {
            var track, videoElement, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Stop existing track
                        if (trackRef.current) {
                            trackRef.current.stop();
                            trackRef.current = null;
                        }
                        // Clear container
                        if (containerRef.current) {
                            containerRef.current.innerHTML = '';
                        }
                        setLoading(true);
                        setError(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Video.createLocalVideoTrack({
                                deviceId: { exact: selectedDeviceId },
                                width: 640,
                                height: 480,
                            })];
                    case 2:
                        track = _a.sent();
                        if (mounted && containerRef.current) {
                            trackRef.current = track;
                            videoElement = track.attach();
                            videoElement.style.width = '100%';
                            videoElement.style.height = '100%';
                            videoElement.style.objectFit = 'cover';
                            videoElement.style.transform = 'scaleX(-1)';
                            containerRef.current.appendChild(videoElement);
                            setLoading(false);
                        }
                        else if (!mounted) {
                            track.stop();
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        if (mounted) {
                            setError((err_2 === null || err_2 === void 0 ? void 0 : err_2.message) || 'Failed to access camera');
                            setLoading(false);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        getVideoTrack();
        return function () {
            mounted = false;
            if (trackRef.current) {
                trackRef.current.stop();
                trackRef.current = null;
            }
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [selectedDeviceId]);
    return (_jsxs(Box, __assign({ sx: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 } }, { children: [devices.length > 0 && (_jsxs(FormControl, __assign({ size: "small", sx: { minWidth: 320 } }, { children: [_jsx(InputLabel, __assign({ id: "camera-select-label" }, { children: "Camera" })), _jsx(Select, __assign({ labelId: "camera-select-label", value: selectedDeviceId, label: "Camera", onChange: function (e) { return setSelectedDeviceId(e.target.value); } }, { children: devices.map(function (device) { return (_jsx(MenuItem, __assign({ value: device.deviceId }, { children: device.label || "Camera ".concat(devices.indexOf(device) + 1) }), device.deviceId)); }) }))] }))), _jsxs(Box, __assign({ sx: __assign({ width: 320, height: 240, backgroundColor: '#1a1a1a', borderRadius: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }, style) }, { children: [loading && _jsx(CircularProgress, { size: 24, sx: { color: 'white' } }), error && (_jsx(Typography, __assign({ color: "error", variant: "body2", textAlign: "center", sx: { p: 2 } }, { children: error }))), _jsx(Box, { ref: containerRef, sx: {
                            width: '100%',
                            height: '100%',
                            display: loading || error ? 'none' : 'block',
                        } })] }))] })));
};
//# sourceMappingURL=TwilioLocalPreview.js.map