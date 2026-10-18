// ====== แก้ข้อมูลของคุณที่ไฟล์นี้ไฟล์เดียว ======

const PROFILE = {
  name: "Waz",
  fullNameTh: "ธันวา สมตัว", // ชื่อเต็มโชว์ในส่วน About
  fullNameEn: "Thanwa Somtua",
  role: "Video Editor",
  heroWord: "Portfolio", // ตัวหนังสือใหญ่กลางหน้าแรก
  photo: "assets/me.png", // รูปไดคัท (PNG พื้นหลังโปร่งใส)
  brands: ["AM Hospital", "Derma Innovation", "Rarin", "SOM Balance School", "Sun On", "KU Garden", "Fayda", "INSIDER", "Ballad", "TrackleTrade", "RBS Clinic", "EKOZOU"], // ชื่อลูกค้า (สร้างจากรายการผลงาน) ว่างไว้ = ซ่อนส่วนนี้ // ใส่ชื่อแบรนด์/ลูกค้าจริงเมื่อพร้อม เช่น ["Brand A", "Cafe B"] ว่างไว้ = ซ่อนส่วนนี้
  tagline: "More than a cut, it's a story.",
  about:
    "เรียกผมว่า “วา” ช่างตัดต่อวิดีโอที่ชอบเล่าเรื่องด้วยจังหวะ เสียง และสี " +
    "รับตัดต่อคลิปสั้น โฆษณา และคอนเทนต์ยาว ส่งงานตรงเวลาและแก้ไขตามบรีฟจนจบ",
  stats: [], // ใส่ตัวเลขจริงเมื่อพร้อม เช่น [{ value: "50+", label: "โปรเจกต์" }] ว่างไว้ = ซ่อน
  tools: ["Premiere Pro", "After Effects", "DaVinci Resolve", "CapCut"], // แก้ให้ตรงกับที่ใช้จริง
  services: [
    { title: "คลิปสั้น / Reels / TikTok", desc: "ตัดต่อจังหวะเร็ว ซับไตเติ้ล เอฟเฟกต์ พร้อมโพสต์" },
    { title: "โฆษณา & รีวิวสินค้า", desc: "เล่าจุดขายชัด ดึงคนดูใน 3 วินาทีแรก" },
    { title: "YouTube / Vlog / Podcast", desc: "ตัดต่อยาว ปรับเสียง ใส่กราฟิกและ B-roll" },
    { title: "ซับไตเติ้ล & เกรดสี", desc: "ซับไทยอ่านง่าย และเกรดสีให้ลุคสม่ำเสมอทั้งงาน" },
  ],
  contact: {
    email: "wa.thanwa03@gmail.com",
    line: "thanwaja67", // LINE ID
    instagram: "", // ยังไม่ใส่ = ไม่แสดงปุ่ม
    youtube: "",
  },
};

// ===== รายการผลงาน — จัดเป็น ลูกค้า (client) → รายการ (program, ไม่บังคับ) → คลิป =====
// client:   ชื่อลูกค้า (ใช้จัดกลุ่ม + ปุ่มกรอง) · program: ชื่อรายการ/ซีรีส์ของลูกค้า (ไม่ใส่ก็ได้)
// type:     "wistia" | "vimeo" | "youtube" | "drive" | "file"
// src:      wistia = media-id จากโค้ดฝัง (เช่น 6ix7bych3k) · vimeo = เลขหลัง vimeo.com/ (+ hash: ถ้า Unlisted)
//           youtube = ID วิดีโอ (Shorts ใช้ ID หลัง /shorts/) · drive = ID ไฟล์ · file = path เช่น "videos/a.mp4"
// vertical: true = แนวตั้ง 9:16 · ไม่ใส่ = แนวนอน 16:9   · dur: ความยาว (วินาที) โชว์บนการ์ด
// thumb:    รูปปก (ลิงก์หรือ path) — คลิป Wistia ไม่ต้องแก้: เว็บดึงภาพปกล่าสุดจาก Wistia เอง ช่องนี้เป็นตัวสำรอง · post / stats: ลิงก์โพสต์จริง IG/FB/TikTok + ยอดวิว (ไม่บังคับ)
// showreel: true = ให้ปุ่ม "Play reel" หน้าแรกเล่นคลิปนี้ (ไม่ใส่ = เล่นคลิปแรกสุด)
const WORKS = [
  { client: "AM Hospital", program: "beyond change", title: "ครีม", type: "wistia", src: "n7ggzyrjr5", dur: 23, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/afe57af838453a991d08953dae057203.jpg?image_crop_resized=360x640" },
  { client: "AM Hospital", program: "beyond change", title: "เปียโน", type: "wistia", src: "vkya9hy6jv", dur: 29, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/812bf518cf904da1bd1c9dbe3cb50c23.jpg?image_crop_resized=360x640" },
  { client: "AM Hospital", program: "beyond change", title: "ธัญญ่า", type: "wistia", src: "9wn3iso1wi", dur: 23, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/dd5c870e8f2bd22739400fcef3bcd6c5.jpg?image_crop_resized=360x640" },
  { client: "AM Hospital", program: "beyond change", title: "ดีดี้", type: "wistia", src: "dj7z9thyv2", dur: 20, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/72262f41dc284facf1cc834d2859bc7a.jpg?image_crop_resized=360x640" },
  { client: "AM Hospital", program: "beyond change", title: "จีน", type: "wistia", src: "0oxohgnzrs", dur: 22, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/04b88daeb6278e33b46ce0b0ce0834de.jpg?image_crop_resized=360x640" },
  { client: "AM Hospital", program: "beyond change", title: "แน๊น", type: "wistia", src: "72vza6utvj", dur: 19, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/ec29125305d8e4a689b1939bbe7ed821.jpg?image_crop_resized=360x640" },
  { client: "AM Hospital", program: "beyond change", title: "มุก", type: "wistia", src: "0zl4wp56y1", dur: 18, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/ec269f6e10d1fa40bb3a4b3f69cad143.jpg?image_crop_resized=360x640" },
  { client: "AM Hospital", program: "Her's Talk", title: "K.Tom — ตอนเต็ม", type: "wistia", src: "e9woaqjpfh", dur: 2100, thumb: "https://embed-ssl.wistia.com/deliveries/4233aaa128e48d4a184a38d0037438c5.jpg?image_crop_resized=480x270" },
  { client: "AM Hospital", program: "Her's Talk", title: "K.Tom — Short 1", type: "wistia", src: "quvyxqz8ro", dur: 167, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/912e35e033c091de2b0abc92cc2a0a98.jpg?image_crop_resized=360x640" },
  { client: "AM Hospital", program: "Her's Talk", title: "K.Tom — Short 2", type: "wistia", src: "rz51fn70yp", dur: 77, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/5f544eff72029b82a6cda0291615ea63.jpg?image_crop_resized=360x640" },
  { client: "AM Hospital", program: "Her's Talk", title: "K.Tom — Short 3", type: "wistia", src: "bin57d0za7", dur: 85, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/aac431476c06d5edf037c86c8a4bc037.jpg?image_crop_resized=360x640" },
  { client: "AM Hospital", program: "Talk with Doc", title: "ผู้ชายหมดหวังกับ SixPack", type: "wistia", src: "iitdlw8v4q", dur: 96, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/4b9a053c828a09d798ea113b9511ff9d.jpg?image_crop_resized=360x640" },
  { client: "AM Hospital", program: "Talk with Doc", title: "หุ่นดีอยู่แล้ว มาดูดไขมันทําไม", type: "wistia", src: "x15t0yn8m7", dur: 88, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/5d9e7e59da245a4ec5eb654b685ea0a8.jpg?image_crop_resized=360x640" },
  { client: "AM Hospital", program: "Talk with Doc", title: "ออกกําลังหนักหุ่นในฝัน", type: "wistia", src: "rkufnzodsk", dur: 85, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/e14bdd7d44ce23f4eb96566e03ea032e.jpg?image_crop_resized=360x640" },
  { client: "Derma Innovation", title: "NEW PROJECT IS COMING!", type: "wistia", src: "c0j3pqon6k", dur: 49, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/fbfc18bcbe38c15aaab24d657e3fe739.jpg?image_crop_resized=360x640" },
  { client: "Rarin", title: "Unforgettable Granseur", type: "wistia", src: "03b79mm8z9", dur: 32, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/adf4f0b43ff783389c37ca7aa1e55945a1e67f69.jpg?image_crop_resized=360x640" },
  { client: "Rarin", title: "Ballad EV Space", type: "wistia", src: "639o845gne", dur: 39, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/a951a5898af5a3cb20313e5cc379fa9e38d84a99.jpg?image_crop_resized=360x640" },
  { client: "Rarin", title: "Wedding mood", type: "wistia", src: "jbqi3zph7k", dur: 19, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/7820e05ccb73e52c29375f67040407b203f6fc1c.jpg?image_crop_resized=360x640" },
  { client: "Rarin", title: "Old Ballad to New Ballad", type: "wistia", src: "tka377tjlg", dur: 36, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/f23b271a8f32de79f2f54e5b5f158c4d23c0482c.jpg?image_crop_resized=360x640" },
  { client: "Rarin", title: "曼谷高端商务活动首选", type: "wistia", src: "dkkw9itkah", dur: 61, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/b6f33783229d7a94e7709f9dd63683ccd9430a93.jpg?image_crop_resized=360x640" },
  { client: "Rarin", title: "The Golden River Symphony", type: "wistia", src: "3c8scufqam", dur: 16, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/48d2562a6e9d2df8399935ecec077c922b9b1d42.jpg?image_crop_resized=360x640" },
  { client: "SOM Balance School", title: "SOM Balance School Interview", type: "wistia", src: "fmqi44r6ed", dur: 90, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/62478e9f84749b34752efa3cb0f096b9c1bcbd1c.jpg?image_crop_resized=360x640" },
  { client: "Sun On", title: "ถึงคุณแม่ที่เรายังไม่ได้เจอ", type: "wistia", src: "d6jku8r3og", dur: 63, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/94f81d5f0a6ae4403589fd562a57f116dfcbf9be.jpg?image_crop_resized=360x640" },
  { client: "Sun On", title: "สร้าง Der mum แบบจริงใจ", type: "wistia", src: "i2qj74ycew", dur: 57, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/a03bad5aa7f43a57fe07ff894bed581b342c4cf4.jpg?image_crop_resized=360x640" },
  { client: "KU Garden", program: "Sitcom", title: "พนักงานใหม่ VS พึ่งผ่านโปร", type: "wistia", src: "7n2wzmp5zo", dur: 57, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/9ca7d2a13577cfebf658f3e485597bbb4a045c5e.jpg?image_crop_resized=360x640" },
  { client: "KU Garden", program: "Sitcom", title: "ทําแบบนี้ได้คงฟิน ป้ายแทนใจ", type: "wistia", src: "5rdecu7ad7", dur: 78, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/224a15f39c6d69cef6e371214866f91c8b75212d.jpg?image_crop_resized=360x640" },
  { client: "KU Garden", program: "Podcast", title: "แคชเชียรก็แค่คิดเงินป่ะ", type: "wistia", src: "o1mb4cy2sf", dur: 66, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/0fe7de70f26cd286c872102085ef5205f12a01db.jpg?image_crop_resized=360x640" },
  { client: "KU Garden", program: "Podcast", title: "วิธีรับมือกับคน Toxic", type: "wistia", src: "lu1m761uh2", dur: 90, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/715c0f9117eb6271d3d3a5f2773afa9919bf833c.jpg?image_crop_resized=360x640" },
  { client: "KU Garden", program: "Podcast", title: "คนเก่ง หรือ คนทัศนคติดี", type: "wistia", src: "21k7wbvxk6", dur: 77, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/e0edbc5405edb1f8ca8c2e1cad71cd45fb1f2b2d.jpg?image_crop_resized=360x640" },
  { client: "Fayda", title: "จุดเปลี่ยนระหว่าง เคสเกม กับ ธุรกิจ คือลูก", type: "wistia", src: "swqn4860uc", dur: 86, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/a33516fde6ae5f847a9e92df7715e746.jpg?image_crop_resized=360x640" },
  { client: "Fayda", title: "โมเม้นความคิดแรกที่อยากจะทําสบู่", type: "wistia", src: "6ix7bych3k", dur: 81, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/7d611e8fd43d55062f1932fd6bc7dab6.jpg?image_crop_resized=360x640" },
  { client: "Fayda", title: "คอมเม้นท์รีวิว-1 ดาว", type: "wistia", src: "i6oxqrmkf6", dur: 89, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/fa3ff723e996ddfec593fd7db40c4e1a.jpg?image_crop_resized=360x640" },
  { client: "Fayda", title: "ผีก็ต้องการดูแลนะ", type: "wistia", src: "me4bgcnr8g", dur: 91, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/b93334608a533902aa345659897e5fac3e08308f.jpg?image_crop_resized=360x640" },
  { client: "Fayda", title: "คุณจะอยู่ได้อีกไม่นาน", type: "wistia", src: "lw0zhv1gn9", dur: 75, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/3c5be89ec4b920d86a8770cf201feca0a8f69666.jpg?image_crop_resized=360x640" },
  { client: "INSIDER", title: "พี่คนนี้เดินมา 3 เดือน", type: "wistia", src: "oraiyqczac", dur: 72, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/271113ba4a79c24d32fbe0765e3b440e3cc19c0e.jpg?image_crop_resized=360x640" },
  { client: "INSIDER", title: "ทําไมต้องเลือก Solis", type: "wistia", src: "12shtm91io", dur: 64, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/4901ddca6d47107657c53de3ada225f9c6477a7d.jpg?image_crop_resized=360x640" },
  { client: "INSIDER", title: "ทําไมต้องเลือก Huawei", type: "wistia", src: "v1aw1xduzr", dur: 55, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/a3481ba96928eda8d7ca24892f4f448ace3008e6.jpg?image_crop_resized=360x640" },
  { client: "Ballad", title: "Drone Freeze", type: "wistia", src: "soleq7qwss", dur: 37, thumb: "https://embed-ssl.wistia.com/deliveries/0fe2ffd46c75b2582c7e90c83b25505c4d72fd6b.jpg?image_crop_resized=480x270" },
  { client: "Ballad", title: "Walk around kitchen", type: "wistia", src: "8lyq5gcv9g", dur: 76, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/5013c39f0bc230677f35b44d034f7f7826be0013.jpg?image_crop_resized=360x640" },
  { client: "TrackleTrade", title: "Life with TrackleTrade", type: "wistia", src: "orxx7efc2i", dur: 17, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/882d50e98244c1bba023dfdf5f3971e9680348a0.jpg?image_crop_resized=360x640" },
  { client: "TrackleTrade", title: "Traders", type: "wistia", src: "7mt1ulh5fx", dur: 19, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/fc67f8047adf8f5c4d2ab44728b339d4.jpg?image_crop_resized=360x640" },
  { client: "TrackleTrade", title: "Traders Talk", type: "wistia", src: "furxpj3wgz", dur: 89, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/bb58c3575d734fa7d9b23ba30ce53652.jpg?image_crop_resized=360x640" },
  { client: "RBS Clinic", title: "อัปเดตเสริมจมูก", type: "wistia", src: "bga3hmlwsg", dur: 50, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/327f91edae84bc4ddb1402b446bf96910ce1c8fa.jpg?image_crop_resized=360x640" },
  { client: "RBS Clinic", title: "DR.Toat พาดูคลินิก", type: "wistia", src: "apemorm258", dur: 129, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/720bac717f3241ebd1b777e8938ff2be.jpg?image_crop_resized=360x640" },
  { client: "RBS Clinic", title: "จําเป็นต้องพุ่งมั้ย", type: "wistia", src: "g5wlopdntx", dur: 50, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/2ff0cdd00b0c56d08e440848654fe25e.jpg?image_crop_resized=360x640" },
  { client: "EKOZOU", title: "FOR YOUR SPECIAL ONE", type: "wistia", src: "i59b2wgdaf", dur: 16, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/645a0d21ea84e2b9ceea2dc02ebd3cd5.jpg?image_crop_resized=360x640" },
  { client: "EKOZOU", title: "เคลือบเซรามิกดียังไง", type: "wistia", src: "w3a7qaehyi", dur: 53, vertical: true, thumb: "https://embed-ssl.wistia.com/deliveries/5e0164329add2e73a7d94a0a4392b79f.jpg?image_crop_resized=360x640" },
];
