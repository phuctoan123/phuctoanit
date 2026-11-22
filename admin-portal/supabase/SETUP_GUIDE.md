# Hướng dẫn Setup Supabase cho Admin Portal

## Bước 1 — Chạy SQL để tạo Database

1. Vào **Supabase Dashboard** → Project `zsyiznoqbxyezejllqos`
2. Vào menu **SQL Editor**
3. Dán toàn bộ nội dung file `setup.sql` vào editor
4. Bấm **Run** (hoặc Ctrl+Enter)

> Nếu có lỗi "type already exists" → bỏ qua, enum đã tồn tại từ trước.

---

## Bước 2 — Tạo tài khoản Admin

### Cách A: Qua Dashboard (Khuyến nghị)

1. Vào **Authentication** → **Users** → **Add User**
2. Nhập:
   - **Email:** `phuctoan4906@gmail.com` (hoặc email bạn muốn dùng)
   - **Password:** Đặt mật khẩu mạnh
   - **Email Confirm:** ✅ bật để bỏ qua xác nhận email
3. Sau khi tạo, copy **User UID** (dạng UUID)

### Cách B: Qua SQL

```sql
-- Chạy trong SQL Editor (dùng service role)
select auth.admin_create_user(
  '{"email": "phuctoan4906@gmail.com", "password": "MatKhauManh123!", "email_confirm": true}'
);
```

---

## Bước 3 — Tắt tính năng Sign Up công khai

1. Vào **Authentication** → **Providers** → **Email**
2. Tắt **"Enable Email Signups"** → Save

> Điều này ngăn người khác tự đăng ký tài khoản.

---

## Bước 4 — Kiểm tra đăng nhập

1. Mở `http://localhost:5173/admin/login`
2. Nhập email + password vừa tạo
3. Nếu thành công → redirect sang `/admin` với dữ liệu thật từ Supabase

---

## Bước 5 — Seed dữ liệu mẫu (tuỳ chọn)

Nếu muốn có dữ liệu để test, chạy SQL sau:

```sql
-- Thêm vài Lead mẫu
insert into public.leads (name, company, phone, email, message, services, status, source)
values
  ('Nguyễn Minh Tuấn', 'ABC Trading', '0901234567', 'tuan@abc.vn',
   'Cần thiết kế website thương mại điện tử',
   ARRAY['Thiết kế Website', 'Web Hosting & Deployment'],
   'contacted', 'Website Form'),
  ('Trần Thị Lan Anh', 'Nhà hàng Hương Việt', '0987654321', 'lananh@huongviet.com',
   'Cần giải pháp quản lý kho và bán hàng',
   ARRAY['Giải pháp ERP / CRM'],
   'new', 'Website Form'),
  ('Lê Văn Hùng', 'Trường THPT Nguyễn Trãi', '0912345678', 'hung@truongnguyen.edu.vn',
   'Cần hệ thống quản lý học sinh và học phí',
   ARRAY['Demo & POC', 'Sales Engineering'],
   'poc_in_progress', 'Giới thiệu');

-- Thêm follow-up cho lead đầu tiên
insert into public.follow_ups (lead_id, scheduled_at, content, status)
select id,
  now() + interval '2 hours',
  'Gọi điện tư vấn ban đầu, tìm hiểu nhu cầu chi tiết',
  'pending'
from public.leads
where email = 'tuan@abc.vn';
```

---

## Troubleshooting

### Lỗi "Invalid login credentials"
- Kiểm tra email/password đúng chưa
- Kiểm tra tài khoản đã được confirm chưa (cột `confirmed_at` trong bảng `auth.users`)

### Dữ liệu không hiển thị sau khi đăng nhập
- Kiểm tra RLS policies đã được tạo đúng chưa
- Kiểm tra VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY trong file `.env`
- Mở DevTools → Network → tìm request đến Supabase, xem response

### "permission denied for table leads"
- RLS policy chưa được tạo. Chạy lại phần RLS trong `setup.sql`
- Hoặc tạm thời: Dashboard → Table Editor → leads → Disable RLS (chỉ dùng để test)
