let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

const CLOSURE_DTORS = new FinalizationRegistry(state => {
    wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state)
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
function __wbg_adapter_30(arg0, arg1, arg2) {
    wasm.wasm_bindgen__convert__closures__invoke1_mut__h0437c8246bba0383(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_41(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures__invoke0_mut__h765b3ba826e17e61(arg0, arg1);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
function __wbg_adapter_166(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h340d1be3844cd1bb(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
*/
export const WebRtcErrorCode = Object.freeze({
/**
* The provided access token has expired
*/
AuthorizationSessionExpired:0,"0":"AuthorizationSessionExpired",
/**
* An error occurred which does not belong to any other category
*/
OtherError:1,"1":"OtherError",
/**
* An error was reported by the signaling server that does not belong to any other category
*/
OtherSignalingServerError:2,"2":"OtherSignalingServerError",
/**
* An error was reported by the target that does not belong to any other category
*/
OtherTargetError:3,"3":"OtherTargetError",
/**
* The target has signaling disabled
*/
TargetDisabled:4,"4":"TargetDisabled",
/**
* The specified target is not able to receive the message
*/
TargetDisconnected:5,"5":"TargetDisconnected",
/**
* A playback error was reported by the target
*/
TargetPlaybackError:6,"6":"TargetPlaybackError",
/**
* The connection timed out
*/
Timeout:7,"7":"Timeout",
/**
* The client does not have access to the specified target
*/
UnauthorizedTargetAccess:8,"8":"UnauthorizedTargetAccess",
/**
* A target or signaling server error message associated with an unknown context was received
*/
UnknownContext:9,"9":"UnknownContext",
/**
* An error was reported by the HTMLVideoElement
*/
VideoElementError:10,"10":"VideoElementError",
/**
* A WebRTC connection was unexpectedly closed
*/
WebRtcConnectionClosed:11,"11":"WebRtcConnectionClosed",AudioTransmitFailed:12,"12":"AudioTransmitFailed",
/**
* Ptz operations are not supported on this connection
*/
PtzUnavailable:13,"13":"PtzUnavailable",
/**
* A Ptz error occurring on the client side
*/
PtzClientError:14,"14":"PtzClientError",
/**
* Ptz error occurring on the server side
*/
PtzServerErrorOther:15,"15":"PtzServerErrorOther",
/**
* An error was reported by the browser when interacting with the DOM
*/
DomError:16,"16":"DomError", });

const LiveVideoRequestParamObjectFinalization = new FinalizationRegistry(ptr => wasm.__wbg_livevideorequestparamobject_free(ptr >>> 0));
/**
*/
export class LiveVideoRequestParamObject {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(LiveVideoRequestParamObject.prototype);
        obj.__wbg_ptr = ptr;
        LiveVideoRequestParamObjectFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LiveVideoRequestParamObjectFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_livevideorequestparamobject_free(ptr);
    }
    /**
    * Create new LiveVideoRequestParamObject
    * @param {string} target_id ID of the target to connect to
    * @param {string} target_id
    * @param {TelemetryCallbacks | undefined} telemetry_callbacks
    */
    constructor(target_id, telemetry_callbacks) {
        const ptr0 = passStringToWasm0(target_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        let ptr1 = 0;
        if (!isLikeNone(telemetry_callbacks)) {
            _assertClass(telemetry_callbacks, TelemetryCallbacks);
            ptr1 = telemetry_callbacks.__destroy_into_raw();
        }
        const ret = wasm.livevideorequestparamobject_new(ptr0, len0, ptr1);
        return LiveVideoRequestParamObject.__wrap(ret);
    }
    /**
    * Set organization ID to use in connection. This is required for connections to public signal server.
    * @param {string} org_id Organization ID "owning" the target
    * @param {string} org_id
    */
    setOrgId(org_id) {
        const ptr0 = passStringToWasm0(org_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.livevideorequestparamobject_setOrgId(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * Set streamDetails settings for audio and video. The content depends on the target, but can contain videoReceive, audioReceive and audioSend parameters
    * @param {JsValue} data forwarded to signal server as json (parts can be filtered out depending on setVideoReceive, setAudioReceive and setInputStreams)
    * @param {any} data
    */
    setStreamDetails(data) {
        wasm.livevideorequestparamobject_setStreamDetails(this.__wbg_ptr, addHeapObject(data));
    }
    /**
    * Add audio sources to capture (and send to target)
    * @param {JsValue} array List of devices to capture audio from. Empty list => no audio send
    * @param {any} array
    */
    setInputStreams(array) {
        wasm.livevideorequestparamobject_setInputStreams(this.__wbg_ptr, addHeapObject(array));
    }
    /**
    * Enable or disable video receive. Default value before set is false
    * @param {bool} enable true for enabling video receive, else false
    * @param {boolean} enable
    */
    setVideoReceive(enable) {
        wasm.livevideorequestparamobject_setVideoReceive(this.__wbg_ptr, enable);
    }
    /**
    * Enable or disable audio receive. Default value before set is false
    * @param {bool} enable true for enabling audio receive, else false
    * @param {boolean} enable
    */
    setAudioReceive(enable) {
        wasm.livevideorequestparamobject_setAudioReceive(this.__wbg_ptr, enable);
    }
}

const PlaybackVideoRequestParamObjectFinalization = new FinalizationRegistry(ptr => wasm.__wbg_playbackvideorequestparamobject_free(ptr >>> 0));
/**
*/
export class PlaybackVideoRequestParamObject {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PlaybackVideoRequestParamObject.prototype);
        obj.__wbg_ptr = ptr;
        PlaybackVideoRequestParamObjectFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PlaybackVideoRequestParamObjectFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_playbackvideorequestparamobject_free(ptr);
    }
    /**
    * Expects a VMS API recording structure
    * @param {any} recording_data
    * @param {TelemetryCallbacks | undefined} telemetry_callbacks
    */
    constructor(recording_data, telemetry_callbacks) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            let ptr0 = 0;
            if (!isLikeNone(telemetry_callbacks)) {
                _assertClass(telemetry_callbacks, TelemetryCallbacks);
                ptr0 = telemetry_callbacks.__destroy_into_raw();
            }
            wasm.playbackvideorequestparamobject_new(retptr, addHeapObject(recording_data), ptr0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return PlaybackVideoRequestParamObject.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Sets orgId for this request
    * @param {string} org_id
    */
    setOrgId(org_id) {
        const ptr0 = passStringToWasm0(org_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.playbackvideorequestparamobject_setOrgId(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * Disables autoplay for this request
    */
    setStartPaused() {
        wasm.playbackvideorequestparamobject_setStartPaused(this.__wbg_ptr);
    }
    /**
    * Adjusts start time by specified number of seconds
    *
    * @param offset {number}
    * @param {number} offset
    * @returns {string | undefined}
    */
    addOffset(offset) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.playbackvideorequestparamobject_addOffset(retptr, this.__wbg_ptr, offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Calculates the absolute UTC start time and returns an ISO-8601/rfc339 time string
    * @returns {string | undefined}
    */
    calculateAbsoluteTime() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.playbackvideorequestparamobject_calculateAbsoluteTime(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const PtzCoordsFinalization = new FinalizationRegistry(ptr => wasm.__wbg_ptzcoords_free(ptr >>> 0));
/**
*/
export class PtzCoords {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PtzCoordsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ptzcoords_free(ptr);
    }
    /**
    * @returns {number}
    */
    get x() {
        const ret = wasm.__wbg_get_ptzcoords_x(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set x(arg0) {
        wasm.__wbg_set_ptzcoords_x(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get y() {
        const ret = wasm.__wbg_get_ptzcoords_y(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set y(arg0) {
        wasm.__wbg_set_ptzcoords_y(this.__wbg_ptr, arg0);
    }
}

const PtzPresetFinalization = new FinalizationRegistry(ptr => wasm.__wbg_ptzpreset_free(ptr >>> 0));
/**
*/
export class PtzPreset {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PtzPreset.prototype);
        obj.__wbg_ptr = ptr;
        PtzPresetFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PtzPresetFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ptzpreset_free(ptr);
    }
    /**
    * @returns {number}
    */
    get id() {
        const ret = wasm.__wbg_get_ptzpreset_id(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set id(arg0) {
        wasm.__wbg_set_ptzpreset_id(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {string}
    */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.ptzpreset_name(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
}

const ResolutionFinalization = new FinalizationRegistry(ptr => wasm.__wbg_resolution_free(ptr >>> 0));
/**
*/
export class Resolution {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Resolution.prototype);
        obj.__wbg_ptr = ptr;
        ResolutionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            width: this.width,
            height: this.height,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ResolutionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_resolution_free(ptr);
    }
    /**
    * @returns {number}
    */
    get width() {
        const ret = wasm.__wbg_get_ptzcoords_x(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set width(arg0) {
        wasm.__wbg_set_ptzcoords_x(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get height() {
        const ret = wasm.__wbg_get_ptzcoords_y(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set height(arg0) {
        wasm.__wbg_set_ptzcoords_y(this.__wbg_ptr, arg0);
    }
}

const SignalingHandlerFinalization = new FinalizationRegistry(ptr => wasm.__wbg_signalinghandler_free(ptr >>> 0));
/**
* Signaling server handler
*/
export class SignalingHandler {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SignalingHandler.prototype);
        obj.__wbg_ptr = ptr;
        SignalingHandlerFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SignalingHandlerFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_signalinghandler_free(ptr);
    }
    /**
    * Create new signaling server handler object
    */
    constructor() {
        const ret = wasm.signalinghandler_new();
        return SignalingHandler.__wrap(ret);
    }
    /**
    * Set access token to use in all following messages to signaling server. Can be called at all times, even after connected
    * @param {string} access_token
    * @returns {Promise<void>}
    */
    setAccessToken(access_token) {
        const ptr0 = passStringToWasm0(access_token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.signalinghandler_setAccessToken(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Set error handler callback
    * @param {ErrorCallback} error_callback
    * @returns {Promise<void>}
    */
    setErrorHandler(error_callback) {
        const ret = wasm.signalinghandler_setErrorHandler(this.__wbg_ptr, addHeapObject(error_callback));
        return takeObject(ret);
    }
    /**
    * Connect to signaling server with given URL
    * @param {String} url Complete url to signaling client endpoint
    * @param {String} correlation_id Optional correlation_id that will be passed to the signaling server upon connection
    * @reject {@link WebRtcError}
    * @param {string} url
    * @param {string | undefined} correlation_id
    * @returns {Promise<void>}
    */
    connect(url, correlation_id) {
        const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(correlation_id) ? 0 : passStringToWasm0(correlation_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        const ret = wasm.signalinghandler_connect(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
}

const SnapshotFinalization = new FinalizationRegistry(ptr => wasm.__wbg_snapshot_free(ptr >>> 0));
/**
*/
export class Snapshot {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Snapshot.prototype);
        obj.__wbg_ptr = ptr;
        SnapshotFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            data: this.data,
            width: this.width,
            height: this.height,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SnapshotFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_snapshot_free(ptr);
    }
    /**
    * Pixel data encoded as dataUrl
    * @returns {string}
    */
    get data() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.snapshot_data(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
    /**
    * @returns {number}
    */
    get width() {
        const ret = wasm.snapshot_width(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get height() {
        const ret = wasm.snapshot_height(this.__wbg_ptr);
        return ret;
    }
}

const TelemetryCallbacksFinalization = new FinalizationRegistry(ptr => wasm.__wbg_telemetrycallbacks_free(ptr >>> 0));
/**
*/
export class TelemetryCallbacks {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TelemetryCallbacks.prototype);
        obj.__wbg_ptr = ptr;
        TelemetryCallbacksFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TelemetryCallbacksFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_telemetrycallbacks_free(ptr);
    }
    /**
    * @param {StartSpanCallback} start_span_callback
    * @param {StopSpanCallback} stop_span_callback
    * @param {AddEventCallback} add_event_callback
    */
    constructor(start_span_callback, stop_span_callback, add_event_callback) {
        const ret = wasm.telemetrycallbacks_new(addHeapObject(start_span_callback), addHeapObject(stop_span_callback), addHeapObject(add_event_callback));
        return TelemetryCallbacks.__wrap(ret);
    }
}

const WebRtcContextFinalization = new FinalizationRegistry(ptr => wasm.__wbg_webrtccontext_free(ptr >>> 0));
/**
* Context object containing a video player
*/
export class WebRtcContext {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WebRtcContext.prototype);
        obj.__wbg_ptr = ptr;
        WebRtcContextFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WebRtcContextFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_webrtccontext_free(ptr);
    }
    /**
    * Create new context
    * @param {SignalingHandler} signal_connector Signaling handler object to use for target connection
    * @param {HTMLElement} video_container Container element to fill with video (required to be a <div> element)
    * @param {SignalingHandler} signaling_handler
    * @param {HTMLElement} video_container
    */
    constructor(signaling_handler, video_container) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(signaling_handler, SignalingHandler);
            wasm.webrtccontext_new(retptr, signaling_handler.__wbg_ptr, addHeapObject(video_container));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return WebRtcContext.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Set a correlation ID to that will be forwarded in all communication done within the scope of the request.
    * @param {string} correlationId
    * @param {string} correlation_id
    * @returns {Promise<void>}
    */
    setCorrelationId(correlation_id) {
        const ptr0 = passStringToWasm0(correlation_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.webrtccontext_setCorrelationId(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Register callback for position (currentTime) events
    * @param {Function} callback callback function(position: number) position: seconds as float
    * @param {Function} callback
    * @returns {Promise<void>}
    */
    setPositionChangedHandler(callback) {
        const ret = wasm.webrtccontext_setPositionChangedHandler(this.__wbg_ptr, addHeapObject(callback));
        return takeObject(ret);
    }
    /**
    * Get current position (currentTime)
    * @returns {number} Seconds as float
    * @returns {number}
    */
    getPosition() {
        const ret = wasm.webrtccontext_getPosition(this.__wbg_ptr);
        return ret;
    }
    /**
    * Get current position (currentTime) as an UTC ISO-8601/RFC3339 formatted string
    * @returns {string|undefined} Returns undefined if the operation is unsupported
    * @returns {string | undefined}
    */
    getPositionTimeString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.webrtccontext_getPositionTimeString(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Gets a snapshot of the current playback request (essentially a bookmark)
    * @returns {PlaybackVideoRequestParamObject | undefined}
    */
    getStateBookmark() {
        const ret = wasm.webrtccontext_getStateBookmark(this.__wbg_ptr);
        return ret === 0 ? undefined : PlaybackVideoRequestParamObject.__wrap(ret);
    }
    /**
    * Set mute property
    * @param {boolean} state true = muted, false = unmuted
    * @param {boolean} state
    * @returns {Promise<void>}
    */
    setMuted(state) {
        const ret = wasm.webrtccontext_setMuted(this.__wbg_ptr, state);
        return takeObject(ret);
    }
    /**
    * Get mute property
    * @returns {boolean} true = muted, false = unmuted
    * @returns {Promise<boolean>}
    */
    getMuted() {
        const ret = wasm.webrtccontext_getMuted(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * Start playing
    * @returns {Promise<void>}
    */
    play() {
        const ret = wasm.webrtccontext_play(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * Pause video
    * @returns {Promise<void>}
    */
    pause() {
        const ret = wasm.webrtccontext_pause(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * Check if video is paused
    * @returns {Promise<boolean>}
    */
    isPaused() {
        const ret = wasm.webrtccontext_isPaused(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * Set volume of played audio
    * @param {number} volume Volume as float between 0.0 and 1.0
    * @param {number} volume
    * @returns {Promise<void>}
    */
    setVolumeLevel(volume) {
        const ret = wasm.webrtccontext_setVolumeLevel(this.__wbg_ptr, volume);
        return takeObject(ret);
    }
    /**
    * Get volume of played audio
    * @returns {number} Volume as float between 0.0 and 1.0
    * @returns {Promise<number>}
    */
    getVolumeLevel() {
        const ret = wasm.webrtccontext_getVolumeLevel(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * Register callback for state changes
    * @param {Function} callback
    * @returns {Promise<void>}
    */
    setPlayerStateChangeHandler(callback) {
        const ret = wasm.webrtccontext_setPlayerStateChangeHandler(this.__wbg_ptr, addHeapObject(callback));
        return takeObject(ret);
    }
    /**
    * Register error handler
    * @param {ErrorCallback} error_callback
    * @returns {Promise<void>}
    */
    setErrorHandler(error_callback) {
        const ret = wasm.webrtccontext_setErrorHandler(this.__wbg_ptr, addHeapObject(error_callback));
        return takeObject(ret);
    }
    /**
    * Disconnect target
    */
    disconnect() {
        wasm.webrtccontext_disconnect(this.__wbg_ptr);
    }
    /**
    * Make new request for streaming live
    * Important!
    * Any setting such as muted state, volume level etc will be reset to the following values after this call executed
    *
    * muted: true
    * volume: 0.0
    * position: 0
    *
    * @reject {@link WebRtcError}
    * @param {LiveVideoRequestParamObject} params
    * @returns {Promise<void>}
    */
    requestLive(params) {
        _assertClass(params, LiveVideoRequestParamObject);
        const ret = wasm.webrtccontext_requestLive(this.__wbg_ptr, params.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * Take a snapshot of the currently displayed frame
    * @returns {Promise<Snapshot>}
    */
    takeSnapshot() {
        const ret = wasm.webrtccontext_takeSnapshot(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * Get the video resolution
    * @returns {Resolution}
    */
    getResolution() {
        const ret = wasm.webrtccontext_getResolution(this.__wbg_ptr);
        return Resolution.__wrap(ret);
    }
    /**
    * Sets the access token that will be used for device communication
    * @param {string | undefined} token
    * @returns {Promise<void>}
    */
    setDeviceAccessToken(token) {
        var ptr0 = isLikeNone(token) ? 0 : passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.webrtccontext_setDeviceAccessToken(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Centers the view on the supplied x,y coordinates.
    * Assumes unmodified (offsetX, offsetY) coordinates from a click event handler registered
    * on the video container supplied with the WebRtcContext constructor.
    * @param {number} x
    * @param {number} y
    * @returns {Promise<void>}
    */
    ptzCenter(x, y) {
        const ret = wasm.webrtccontext_ptzCenter(this.__wbg_ptr, x, y);
        return takeObject(ret);
    }
    /**
    * Relative Zoom
    * Zooms in/out by provided number of steps
    * @param {number} steps
    * @returns {Promise<void>}
    */
    ptzRelativeZoom(steps) {
        const ret = wasm.webrtccontext_ptzRelativeZoom(this.__wbg_ptr, steps);
        return takeObject(ret);
    }
    /**
    * Continuous Zoom
    * Zooms continuously with the provided velocity/direction, to stop zooming send a 0 velocity
    * @param {number} velocity
    * @returns {Promise<void>}
    */
    ptzContinuousZoom(velocity) {
        const ret = wasm.webrtccontext_ptzContinuousZoom(this.__wbg_ptr, velocity);
        return takeObject(ret);
    }
    /**
    * Goto Preset
    * @param {number} preset_id
    * @returns {Promise<void>}
    */
    ptzGotoPreset(preset_id) {
        const ret = wasm.webrtccontext_ptzGotoPreset(this.__wbg_ptr, preset_id);
        return takeObject(ret);
    }
    /**
    * Get PTZ presets
    * @returns {Promise<PtzPreset[]>}
    */
    ptzGetPresets() {
        const ret = wasm.webrtccontext_ptzGetPresets(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * Perform a playback request
    *
    * Important!
    * Any setting such as muted state, volume level etc will be reset to the following values after this call executed
    *
    * muted: true
    * volume: 0.0
    *
    * @reject {@link WebRtcError}
    * @param {PlaybackVideoRequestParamObject} params
    * @returns {Promise<void>}
    */
    requestPlayback(params) {
        _assertClass(params, PlaybackVideoRequestParamObject);
        const ret = wasm.webrtccontext_requestPlayback(this.__wbg_ptr, params.__wbg_ptr);
        return takeObject(ret);
    }
}

const WebRtcErrorFinalization = new FinalizationRegistry(ptr => wasm.__wbg_webrtcerror_free(ptr >>> 0));
/**
* Error information provided in exceptions and error callbacks
*/
export class WebRtcError {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WebRtcError.prototype);
        obj.__wbg_ptr = ptr;
        WebRtcErrorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            code: this.code,
            message: this.message,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WebRtcErrorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_webrtcerror_free(ptr);
    }
    /**
    * The type of error
    * @returns {number}
    */
    get code() {
        const ret = wasm.__wbg_get_webrtcerror_code(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * The type of error
    * @param {number} arg0
    */
    set code(arg0) {
        wasm.__wbg_set_webrtcerror_code(this.__wbg_ptr, arg0);
    }
    /**
    * An error message with more information about the error
    * @returns {string}
    */
    get message() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_webrtcerror_message(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
    /**
    * An error message with more information about the error
    * @param {string} arg0
    */
    set message(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_webrtcerror_message(this.__wbg_ptr, ptr0, len0);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_muted_99b83aae8d7824c3 = function(arg0) {
        const ret = getObject(arg0).muted;
        return ret;
    };
    imports.wbg.__wbg_new_18bc2084e9a3e1ff = function() {
        const ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_ptzpreset_new = function(arg0) {
        const ret = PtzPreset.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_push_4c1f8265c2fdf115 = function(arg0, arg1) {
        const ret = getObject(arg0).push(getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlCanvasElement_6e58598b4e8b1586 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof HTMLCanvasElement;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_setwidth_885d5dd3c7f48f41 = function(arg0, arg1) {
        getObject(arg0).width = arg1 >>> 0;
    };
    imports.wbg.__wbg_setheight_0d2b445bb6a5a3f2 = function(arg0, arg1) {
        getObject(arg0).height = arg1 >>> 0;
    };
    imports.wbg.__wbg_getContext_62ccb1aa0e6c8b86 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_CanvasRenderingContext2d_b4050f3a451ac712 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof CanvasRenderingContext2D;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_drawImage_4004cec30aca59dc = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        getObject(arg0).drawImage(getObject(arg1), arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_toDataURL_9b648d51812cc764 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg1).toDataURL();
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_width_3a395887a577233b = function(arg0) {
        const ret = getObject(arg0).width;
        return ret;
    };
    imports.wbg.__wbg_height_b7046017c4148386 = function(arg0) {
        const ret = getObject(arg0).height;
        return ret;
    };
    imports.wbg.__wbg_snapshot_new = function(arg0) {
        const ret = Snapshot.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_volume_5b9838726d9f76b5 = function(arg0) {
        const ret = getObject(arg0).volume;
        return ret;
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_play_550413022c49b953 = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).play();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_DomException_4bdc4a44ecb7f8b8 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof DOMException;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_name_afaaac21bb0a38d7 = function(arg0, arg1) {
        const ret = getObject(arg1).name;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_message_3c3b922f470f01bb = function(arg0, arg1) {
        const ret = getObject(arg1).message;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_webrtcerror_new = function(arg0) {
        const ret = WebRtcError.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_7befa02319b36069 = function() {
        const ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createDataChannel_31df407efc5ac36b = function(arg0, arg1, arg2, arg3) {
        const ret = getObject(arg0).createDataChannel(getStringFromWasm0(arg1, arg2), getObject(arg3));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_setbinaryType_46b7fab36efbff07 = function(arg0, arg1) {
        getObject(arg0).binaryType = takeObject(arg1);
    };
    imports.wbg.__wbg_setonopen_1c13ed465b22cb73 = function(arg0, arg1) {
        getObject(arg0).onopen = getObject(arg1);
    };
    imports.wbg.__wbg_data_ef47af9c565d228b = function(arg0) {
        const ret = getObject(arg0).data;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_9bd285d5c6e3f912 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2), getObject(arg3));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_error_144a38ac2229eae0 = function(arg0, arg1) {
        console.error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_appendBuffer_f9dc2c5cf6507ce8 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).appendBuffer(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_buffered_268677320b61d4bd = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).buffered;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_length_d0b15af37a0c48cb = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_start_8a291ee57d369d1a = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).start(arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_end_f3ddd1d92befb05c = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).end(arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setonupdateend_55bdd78f7b4594e1 = function(arg0, arg1) {
        getObject(arg0).onupdateend = getObject(arg1);
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbg_new_bc5d9aad3f9ac80e = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_length_d9c4ded7e708c6a1 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_warn_69ebd5111c15e956 = function(arg0, arg1) {
        console.warn(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_buffer_fcbfb6d88b2732e9 = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_92c251989c485785 = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_buffer_eedf4f6616e9440d = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_addSourceBuffer_b926c3940c73d4f1 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).addSourceBuffer(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setmode_60dcf39aa23e1ac3 = function(arg0, arg1) {
        getObject(arg0).mode = takeObject(arg1);
    };
    imports.wbg.__wbg_remove_f6b79c42831586ce = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).remove(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_parse_4457078060869f55 = function() { return handleError(function (arg0, arg1) {
        const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_newwithconfiguration_3bea0e09a8c280b6 = function() { return handleError(function (arg0) {
        const ret = new RTCPeerConnection(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setonicecandidate_1987372971fa7deb = function(arg0, arg1) {
        getObject(arg0).onicecandidate = getObject(arg1);
    };
    imports.wbg.__wbg_new_28f6155a410234fb = function() { return handleError(function () {
        const ret = new MediaStream();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setontrack_0d62b2f59e775e70 = function(arg0, arg1) {
        getObject(arg0).ontrack = getObject(arg1);
    };
    imports.wbg.__wbg_setonsignalingstatechange_268406fcdc66c45f = function(arg0, arg1) {
        getObject(arg0).onsignalingstatechange = getObject(arg1);
    };
    imports.wbg.__wbg_setonconnectionstatechange_a18c5633e65eb790 = function(arg0, arg1) {
        getObject(arg0).onconnectionstatechange = getObject(arg1);
    };
    imports.wbg.__wbg_setoniceconnectionstatechange_24edc67669c8d1c4 = function(arg0, arg1) {
        getObject(arg0).oniceconnectionstatechange = getObject(arg1);
    };
    imports.wbg.__wbg_getTracks_d1413cdb1f3d6579 = function(arg0) {
        const ret = getObject(arg0).getTracks();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_length_070e3265c186df02 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_get_e52aaca45f37b337 = function(arg0, arg1) {
        const ret = getObject(arg0)[arg1 >>> 0];
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_MediaStreamTrack_1a0c476ad8346ed4 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof MediaStreamTrack;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_addTrack_1ad1ca1aef48052f = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).addTrack(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_setRemoteDescription_adfad517074cbf16 = function(arg0, arg1) {
        const ret = getObject(arg0).setRemoteDescription(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createAnswer_1114e477a346651b = function(arg0) {
        const ret = getObject(arg0).createAnswer();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_setLocalDescription_e55a8f5560247ce1 = function(arg0, arg1) {
        const ret = getObject(arg0).setLocalDescription(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_candidate_7abc7f2bc2753122 = function(arg0) {
        const ret = getObject(arg0).candidate;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_toJSON_c05e37e37e2deda3 = function(arg0) {
        const ret = getObject(arg0).toJSON();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_track_986fe88da122e626 = function(arg0) {
        const ret = getObject(arg0).track;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kind_66d57229f5e384ab = function(arg0, arg1) {
        const ret = getObject(arg1).kind;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_addTrack_db77457151e124f2 = function(arg0, arg1) {
        getObject(arg0).addTrack(getObject(arg1));
    };
    imports.wbg.__wbg_signalingState_10730052386dc301 = function(arg0) {
        const ret = getObject(arg0).signalingState;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_connectionState_bc6be41cdaa44f62 = function(arg0) {
        const ret = getObject(arg0).connectionState;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_iceConnectionState_3ea985e92d9194d4 = function(arg0) {
        const ret = getObject(arg0).iceConnectionState;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_743ce54265cbfc24 = function() { return handleError(function (arg0) {
        const ret = new RTCIceCandidate(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_addIceCandidate_34af317d3078c590 = function(arg0, arg1) {
        const ret = getObject(arg0).addIceCandidate(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_error_e1e4f0d5f41bfae5 = function(arg0) {
        const ret = getObject(arg0).error;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_message_36aeb136c0db35c4 = function(arg0, arg1) {
        const ret = getObject(arg1).message;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_code_a8c07e5f1a7a965e = function(arg0) {
        const ret = getObject(arg0).code;
        return ret;
    };
    imports.wbg.__wbg_playbackRate_a0aaba79b40f0ce9 = function(arg0) {
        const ret = getObject(arg0).playbackRate;
        return ret;
    };
    imports.wbg.__wbg_close_18f6acc05e28b66d = function() { return handleError(function (arg0) {
        getObject(arg0).close();
    }, arguments) };
    imports.wbg.__wbg_new_113855d7ab252420 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_166(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return addHeapObject(ret);
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_new_39e958ac9d5cae7d = function() { return handleError(function (arg0, arg1) {
        const ret = new WebSocket(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setonmessage_493b82147081ec7e = function(arg0, arg1) {
        getObject(arg0).onmessage = getObject(arg1);
    };
    imports.wbg.__wbg_setonopen_6fd8b28538150568 = function(arg0, arg1) {
        getObject(arg0).onopen = getObject(arg1);
    };
    imports.wbg.__wbg_setonclose_6b22bc5d93628786 = function(arg0, arg1) {
        getObject(arg0).onclose = getObject(arg1);
    };
    imports.wbg.__wbg_setonerror_9f7532626d7a9ce2 = function(arg0, arg1) {
        getObject(arg0).onerror = getObject(arg1);
    };
    imports.wbg.__wbg_readyState_a5aaf63a7efc5d14 = function(arg0) {
        const ret = getObject(arg0).readyState;
        return ret;
    };
    imports.wbg.__wbg_childNodes_467e3b83caedfffe = function(arg0) {
        const ret = getObject(arg0).childNodes;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_length_516aa90243ee5548 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_get_0eccda4acfdf744b = function(arg0, arg1) {
        const ret = getObject(arg0)[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_style_490ba346de45c9a1 = function(arg0) {
        const ret = getObject(arg0).style;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_appendChild_173b88a25c048f2b = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).appendChild(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlVideoElement_c4015642814a4898 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof HTMLVideoElement;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_close_2a9dab986c338346 = function(arg0) {
        getObject(arg0).close();
    };
    imports.wbg.__wbg_isArray_07d89ced8fb14171 = function(arg0) {
        const ret = Array.isArray(getObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_instanceof_MediaStream_d9de519c471c60ad = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof MediaStream;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_removeAttributeNS_ebeb2d7e18202e40 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).removeAttributeNS(arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_new_539eb124a61a4785 = function() { return handleError(function () {
        const ret = new MediaSource();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setonsourceclose_6eeb3ac29f3602a1 = function(arg0, arg1) {
        getObject(arg0).onsourceclose = getObject(arg1);
    };
    imports.wbg.__wbg_setonsourceended_3402d6d7004b65b3 = function(arg0, arg1) {
        getObject(arg0).onsourceended = getObject(arg1);
    };
    imports.wbg.__wbg_addEventListener_7759570e045ab41e = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
    }, arguments) };
    imports.wbg.__wbg_setonsourceopen_8f8f5e1d05fa6f78 = function(arg0, arg1) {
        getObject(arg0).onsourceopen = getObject(arg1);
    };
    imports.wbg.__wbg_createObjectURL_77dc0b4a14ea746e = function() { return handleError(function (arg0, arg1) {
        const ret = URL.createObjectURL(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_setsrc_6031c5d09d6eb5ae = function(arg0, arg1, arg2) {
        getObject(arg0).src = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_crypto_e1d53a1d73fb10b8 = function(arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_process_038c26bf42b093f8 = function(arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_versions_ab37218d2f0b24a8 = function(arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_080f4b19d15bc1fe = function(arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_require_78a3dcfbdba9cbce = function() { return handleError(function () {
        const ret = module.require;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbg_msCrypto_6e7d3e1f92610cbb = function(arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithlength_89eca18f2603a999 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbg_clearTimeout_76877dbc010e786d = function(arg0) {
        const ret = clearTimeout(takeObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_get_363c3b466fe4896b = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_self_b9aad7f1c618bfaf = function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_55e469842c98b086 = function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_d0957e302752547e = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_ae2f87312b8987fb = function() { return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_newnoargs_e643855c6572a4a8 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_f96b398515635514 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_35782e9a1aa5e091 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_set_bc33b7c3be9319b5 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_stringify_9003c389758d16d4 = function() { return handleError(function (arg0) {
        const ret = JSON.stringify(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_set_4b3aa8445ac1e91c = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_setTimeout_75cb9b6991a4031d = function() { return handleError(function (arg0, arg1) {
        const ret = setTimeout(getObject(arg0), arg1);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_randomFillSync_6894564c2c334c42 = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_subarray_7649d027b2b141b3 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getRandomValues_805f1c3d65988a5a = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_then_65c9631eb0022205 = function(arg0, arg1) {
        const ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_cde1713a812adbda = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_resolve_f3a7b38cd2af0fa4 = function(arg0) {
        const ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_Window_f2bf9e8e91f1be0d = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Window;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_setProperty_66e3a889ea358430 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_createElement_5281e2aae74efc9d = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).createElement(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_clientWidth_8c5ed3bb9e57ac78 = function(arg0) {
        const ret = getObject(arg0).clientWidth;
        return ret;
    };
    imports.wbg.__wbg_clientHeight_2aabb12a10262dce = function(arg0) {
        const ret = getObject(arg0).clientHeight;
        return ret;
    };
    imports.wbg.__wbg_removeAttribute_cb0c24f7c8064e7e = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).removeAttribute(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_setAttributeNS_c063456a4edf4a5f = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        getObject(arg0).setAttributeNS(arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4), getStringFromWasm0(arg5, arg6));
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlElement_edb6b41b4b7de6a7 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof HTMLElement;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_setonplaying_eef639b02e8d215f = function(arg0, arg1) {
        getObject(arg0).onplaying = getObject(arg1);
    };
    imports.wbg.__wbg_setontimeupdate_846806b1f6577bcf = function(arg0, arg1) {
        getObject(arg0).ontimeupdate = getObject(arg1);
    };
    imports.wbg.__wbg_setonerror_542ab43d93db61c4 = function(arg0, arg1) {
        getObject(arg0).onerror = getObject(arg1);
    };
    imports.wbg.__wbg_setsrcObject_b015ea414d275cd8 = function(arg0, arg1) {
        getObject(arg0).srcObject = getObject(arg1);
    };
    imports.wbg.__wbg_currentTime_6d88c4cbfcfcbfd1 = function(arg0) {
        const ret = getObject(arg0).currentTime;
        return ret;
    };
    imports.wbg.__wbg_setcurrentTime_39e95fa860ea82b2 = function(arg0, arg1) {
        getObject(arg0).currentTime = arg1;
    };
    imports.wbg.__wbg_paused_12fc56a26e63aaaf = function(arg0) {
        const ret = getObject(arg0).paused;
        return ret;
    };
    imports.wbg.__wbg_setautoplay_1ef69f03839a694c = function(arg0, arg1) {
        getObject(arg0).autoplay = arg1 !== 0;
    };
    imports.wbg.__wbg_setvolume_d8455636fd526043 = function(arg0, arg1) {
        getObject(arg0).volume = arg1;
    };
    imports.wbg.__wbg_setmuted_ac6bc73c1769378b = function(arg0, arg1) {
        getObject(arg0).muted = arg1 !== 0;
    };
    imports.wbg.__wbg_pause_a2f8db64e3a87aa8 = function() { return handleError(function (arg0) {
        getObject(arg0).pause();
    }, arguments) };
    imports.wbg.__wbg_videoWidth_d2527c6815290c0d = function(arg0) {
        const ret = getObject(arg0).videoWidth;
        return ret;
    };
    imports.wbg.__wbg_videoHeight_5621215e6f19c3a0 = function(arg0) {
        const ret = getObject(arg0).videoHeight;
        return ret;
    };
    imports.wbg.__wbg_nodeName_8bc1c2e456bf3655 = function(arg0, arg1) {
        const ret = getObject(arg1).nodeName;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_setonmessage_885d925efcdfac19 = function(arg0, arg1) {
        getObject(arg0).onmessage = getObject(arg1);
    };
    imports.wbg.__wbg_send_8038301863972705 = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).send(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_send_45db219b9f40cc7e = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).send(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_document_a11e2f345af07033 = function(arg0) {
        const ret = getObject(arg0).document;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper238 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 9, __wbg_adapter_30);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper240 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 9, __wbg_adapter_30);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper242 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 9, __wbg_adapter_30);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper1118 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 73, __wbg_adapter_30);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper1134 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 73, __wbg_adapter_30);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper1255 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 73, __wbg_adapter_41);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper1256 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 73, __wbg_adapter_30);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper2221 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 91, __wbg_adapter_30);
        return addHeapObject(ret);
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('webrtcvideo_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
