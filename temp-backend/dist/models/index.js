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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicReport = exports.Topic = exports.Feedback = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true
    },
    username: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    avatar_url: {
        type: String,
        default: "https://imgs.search.brave.com/6wkaBbsmkyuEl7tbLrfD-ZYYiaR8FxHZfH_4EVzu9wk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDAv/MjQzLzQxNy9zbWFs/bC9zcHktaWNvbi12/ZWN0b3IuanBn"
    },
    acceptingFeedbacks: {
        type: Boolean,
        default: true
    },
    personalFeedbacks: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Feedback"
        }],
    verifyCode: {
        type: String,
        default: null
    },
    verifyCodeExpiry: {
        type: Date,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified("password")) {
            user.password = yield bcrypt_1.default.hash(user.password, 5);
        }
        next();
    });
});
userSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
const User = (mongoose_1.default.models.User) || (mongoose_1.default.model("User", userSchema));
exports.User = User;
const topicSchema = new mongoose_1.Schema({
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    allowingFeedbacks: {
        type: Boolean,
        default: true
    },
    feedbacksPublic: {
        type: Boolean,
        default: true
    },
    thumbnail_url: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});
const Topic = (mongoose_1.default.models.Topic) || (mongoose_1.default.model("Topic", topicSchema));
exports.Topic = Topic;
const topicReportSchema = new mongoose_1.Schema({
    topicId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Topic",
        required: true
    },
    rating: {
        type: Number,
        default: null
    },
    nPositive: {
        type: Number,
        default: null
    },
    nNegative: {
        type: Number,
        default: null
    },
    improvements: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});
const TopicReport = mongoose_1.default.models.TopicReport || mongoose_1.default.model("TopicReport", topicReportSchema);
exports.TopicReport = TopicReport;
const feedbackSchema = new mongoose_1.Schema({
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    topicId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Topic",
        default: null
    },
    note: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
// feedbackSchema.pre("save",function(next){
//     const feedback = this;
//     if(!feedback.owner && !feedback.topic) {
//         next( new DBError(403,"Owner or topic not provided while creating the feedback"))
//     }
//     next();
// })
const Feedback = (mongoose_1.default.models.Feedback) || (mongoose_1.default.model("Feedback", feedbackSchema));
exports.Feedback = Feedback;
