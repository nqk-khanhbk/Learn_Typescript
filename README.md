# Learn_Typescript
# Cài đặt dự án Typescript với ExpressJs
1. Khởi tạo
```c
  npm init
```
2.Cài thư viện expressJs
```c
  npm install express
```
3. Cài tiếp các npm sau
```c
    npm i --save-dev nodemon
    npm i --save-dev typescript
    npm i --save-dev ts-node
    npm i --save-dev @type/node @type/express
```

4.Sau khi cài xong tạo file có tên tùy ý,chẳng hạn index.ts

5.Thêm đoạn code sau vào file package.json
```c
      "start":"nodemon index.ts",
```
6.Thêm file tsconfig.json và thêm đoạn code sau
```c
  {
    "compilerOptions": {
       "target": "ES6", // Cho phép phiên dịch code typescript sang kiển ES6
       "module": "CommonJS",//CommonJS là tiêu chuân được sử dụng trong Node.js để làm việc với các module
       "removeComments": true ,// xoá comments khi bien dịch sang file js
       "esModuleInterop": true ,// Dùng được từ khoá import thay cho require
       "outDir": "dist",//Bien dich vao thu muc dist
    }
 }
```
