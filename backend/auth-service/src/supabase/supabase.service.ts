import {Injectable} from '@nestjs/common';
import {createClient, SupabaseClient} from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;// khai báo thuộc tính supabase để lưu client sau khi tạo

    constructor(){ 
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
            throw new Error('Missing Supabase environment variables');
        }
        // khởi tạo client trong constructor để có thể sử dụng trong toàn bộ service
        this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY); 
        // thêm "!" để khẳng định rằng biến môi trường không phải là undefined
    }

    // khai báo phương thức
    getClient(){// phương thức trả về client đã được khởi tạo
        return this.supabase;
    }
}
// getClient() trả về client đã được khởi tạo trong constructor, giúp các service khác có thể sử dụng được supabase client thông qua SupabaseService.
// các thao tác của client được thư viện hỗ trợ sẵn là delete, update, select, insert,... nên không cần phải khai báo lại trong service này. 
// Khi cần sử dụng client, chỉ cần gọi getClient() để lấy client và thực hiện các thao tác với database.