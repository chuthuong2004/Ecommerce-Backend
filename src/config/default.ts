import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 1337;
const config = {
  port: PORT,
  corsOrigin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://koga-clothes.vercel.app",
    "http://192.168.1.4:3000",
    "http://192.168.1.4:3001",
  ],
  dbUri:
    "mongodb+srv://chuthuong1080:105870820196Thuong@cluster0.zy4fa.mongodb.net/chuthuong-online?retryWrites=true&w=majority",
  saltWorkFactor: 10,
  accessTokenTtl: "30s",
  refreshTokenTtl: "1y",
  privateKey: `-----BEGIN RSA PRIVATE KEY-----
    MIICWwIBAAKBgQCQNBc4IP2ewViqE+ZHbnqGoCZFyAUtrxKmO4k/boSvBisJH6BX
    01ajpafM7c7f5PO+wAcGYIxiTQsv9ml2/cgnB6MWG/YYKDCfbWLNbpvQxYlUCu0f
    bRHc4dYM3AysBpx/SE9JNAlUoRsuQ05PP3U0IsM9FzYUpyZ9TDR7bjPYyQIDAQAB
    AoGABnnAXS3mFb36/FA+dBC7AdapQVL1IJMPFFXyGN4eqTlur08zRR5hcqHawjIf
    qyA97d/zsM6fHz70dKftHoHQ/hZKfWsBr2+R8C7rY/tlJhM24kqusDvNA9AMNoQW
    K4+DF+J05q5a+VWjP07Y976LZjq+vXlEVBfEiHig4wECaDECQQDbRQ5L9Mcibd5a
    R+Y3LxtXu0agpSG1dYDcWlLzRAt6yDD/EziRV8DSFyvgj1amO0SQ+2K/Hp5BEHii
    fDJB48ZFAkEAqFv32dNZcBy4IKAAHPgxhsYBcuUCHGfwwxxXJ3DjjZlhuR4K9YjO
    0alf4zNOlUyoULe9z+OAIgIqI9EyIX2itQJAShMeLVLYIy1yvJUllOb5Gb5Osd6X
    cLHtgoORGlWWezg+NS3NImy+2zqwvAAwiZ/kHgaO6XnyhJCH8Hx8jf3g8QJAepLK
    tlo7iXY/T/FtY6oHVNof/+hfSxMZpNOjWGHGKjd7gG0xCWZbPSYVW7LlCanP+URs
    +0fk592vlHggCWYQ6QJANZzno1FwUOjtGLeKm83ZGdbo3K+00i25FmBgB2d0uAtk
    noxFVOjsY+eSXHZqNybrhWRAzutSnpz/QEf/7Vg97g==
    -----END CERTIFICATE-----`,
  smtp: {
    user: "chuthuong1080@gmail.com",
    pass: "nrnggpexvmuwyicz",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
  },
};
export default config;
