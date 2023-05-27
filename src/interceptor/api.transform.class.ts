export class ResponseMessage {
    readonly data: any;
    readonly code: number;
    readonly message: string;

    constructor(code: number, data?: any, message = 'success') {
        this.code = code;
        this.data = data;
        this.message = message;
    }

    static success(data?: any) {
        return new ResponseMessage(200, data);
    }

    static err(res_data?: any) {
        return new ResponseMessage(res_data.code, res_data.data || [], res_data.message);
    }
}
