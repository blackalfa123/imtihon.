# Najot Ta'lim Student Portal

## Ishga tushirish
1. `npm install` (bir marta)
2. `backend/.env` ichida `MONGODB_URI` ga o'z Atlas connection stringingizni yozing (baza nomi: `test`).
3. `nodemon server.js`
4. Brauzerda http://localhost:3000 — holatni http://localhost:3000/api/health da ko'rasiz (`db: connected` bo'lishi kerak).

## Atlas sozlamalari
- Database Access: user yarating (parolda @ : / ? # bo'lsa URL-encode qiling yoki oddiy parol qo'ying).
- Network Access: o'z IP manzilingiz yoki test uchun 0.0.0.0/0.
- Connect > Drivers > Node.js: stringni oling. `querySrv EBADRESP` chiqsa — non-SRV `mongodb://` stringni oling yoki DNS ni 8.8.8.8 ga o'zgartiring.
