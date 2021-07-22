"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const Logger_1 = require("/opt/Shared/Logger/Logger");
exports.handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let message = 'Hello, World2!';
    Logger_1.Logger.log(message);
    const response = {
        statusCode: 200,
        body: JSON.stringify(message),
    };
    return response;
});
//# sourceMappingURL=index.js.map