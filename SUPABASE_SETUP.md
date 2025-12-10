# Hướng dẫn Setup Supabase cho Game

## 1. Tạo Supabase Project

1. Truy cập [Supabase](https://supabase.com) và đăng nhập
2. Tạo project mới
3. Lưu lại **Project URL** và **anon/public key**

## 2. Tạo Database Table

Vào SQL Editor trong Supabase và chạy query sau:

```sql
-- Tạo bảng game_scores
CREATE TABLE game_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  wave INTEGER NOT NULL,
  health INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index để query nhanh hơn (ưu tiên sắp xếp theo điểm số)
CREATE INDEX idx_game_scores_score ON game_scores(score DESC);
CREATE INDEX idx_game_scores_player_name ON game_scores(player_name);
CREATE INDEX idx_game_scores_created_at ON game_scores(created_at DESC);

-- Lưu ý: Bảng xếp hạng sắp xếp theo điểm số (giảm dần), không phụ thuộc thời gian

-- Enable Row Level Security (RLS)
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho phép mọi người đọc
CREATE POLICY "Allow public read access" ON game_scores
  FOR SELECT USING (true);

-- Tạo policy cho phép mọi người insert
CREATE POLICY "Allow public insert" ON game_scores
  FOR INSERT WITH CHECK (true);
```

## 3. Cấu hình Environment Variables

1. Tạo file `.env` trong thư mục root của project
2. Copy nội dung từ `.env.example`
3. Điền thông tin Supabase:

```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Khởi động lại ứng dụng

Sau khi cấu hình xong, khởi động lại ứng dụng:

```bash
npm start
```

## Lưu ý

- File `.env` đã được thêm vào `.gitignore` để không commit lên git
- Nếu không có Supabase, game vẫn chạy được nhưng không lưu điểm số
- Có thể test với Supabase local hoặc dùng free tier của Supabase

