/**
 * Divination Engine: kho quẻ xăm, luận theo chủ đề, Can Chi - Nạp Âm - Cung Phi, luận cung Tử Vi.
 */

const Q = (rank, type, title, poem, meaning) => ({
  rank, type, title, poem: poem.split("|").join("\n"), meaning,
});

const FORTUNE_DATABASE = [
  Q("Thượng Thượng Cát", "auspicious", "Quẻ Số 01: Phi Long Tại Thiên",
    "Rồng gặp mây lành thỏa chí bay,|Công danh sự nghiệp rạng từ đây.|Muôn việc mưu cầu đều thuận lợi,|Phúc lộc dồi dào tựa cỏ cây.",
    "Thời vận đang ở đỉnh cao. Kế hoạch lớn, thi cử, khởi nghiệp hay cầu tài đều được quý nhân dẫn lối."),
  Q("Thượng Cát", "auspicious", "Quẻ Số 02: Khô Mộc Phùng Xuân",
    "Cây khô gặp lại tiết xuân tươi,|Chồi biếc đơm hoa rạng rỡ cười.|Bao nỗi nhọc nhằn nay khép lại,|Đường đời rộng mở ánh dương mười.",
    "Sau chuỗi ngày vất vả, vận may quay trở lại. Những bế tắc cũ sẽ sớm được tháo gỡ."),
  Q("Trung Bình", "neutral", "Quẻ Số 03: Minh Nguyệt Chiếu Giang",
    "Trăng sáng soi dòng nước lặng trôi,|Tâm an vạn sự tự yên rồi.|Chớ nên vội vã cầu danh lợi,|Chậm bước mà đi vững trọn đời.",
    "Vận trình bình ổn. Giai đoạn này nên trau dồi kiến thức, củng cố nền tảng hơn là mạo hiểm."),
  Q("Thượng Cát", "auspicious", "Quẻ Số 04: Ngọc Xuất Côn Sơn",
    "Ngọc quý nằm sâu chốn núi cao,|Mài giũa công phu sáng biết bao.|Gặp người tri kỷ cùng nâng bước,|Danh tiếng vang xa tự thuở nào.",
    "Năng lực của bạn sắp được ghi nhận xứng đáng. Sắp tới có cộng sự tốt hoặc cơ hội hợp tác triển vọng."),
  Q("Hạ Quẻ (Cẩn Trọng)", "ominous", "Quẻ Số 05: Cô Chu Quá Hải",
    "Thuyền nhỏ ra khơi gặp gió dông,|Sóng cao biển rộng biết đâu trông.|Thu buồm giữ lái chờ giông tạnh,|Ắt có ngày mai nắng ấm nồng.",
    "Thời thế nhiều biến động. Nên khiêm nhường, cẩn trọng lời nói và hoãn các quyết định mạo hiểm."),
  Q("Đại Cát", "auspicious", "Quẻ Số 06: Kim Bảng Đề Danh",
    "Bao ngày đèn sách luyện tinh anh,|Chí lớn vươn cao rạng sử xanh.|Thuận gió buồm căng ra biển lớn,|Công thành danh toại phúc an lành.",
    "Học vấn, thi cử, dự án mới đều gặp thời. Hãy tự tin triển khai kế hoạch đã chuẩn bị."),
  Q("Cát", "auspicious", "Quẻ Số 07: Xuân Phong Đắc Ý",
    "Gió xuân thổi nhẹ khắp muôn nơi,|Hoa nở đầy sân rạng nụ cười.|Việc nhỏ làm nên điều lớn lắm,|Lòng thành cảm động đến trời xanh.",
    "Mọi việc thuận buồm xuôi gió, nhất là các mối quan hệ. Giữ lòng thành sẽ gặt quả ngọt."),
  Q("Trung Bình", "neutral", "Quẻ Số 08: Bình Địa Khởi Lầu",
    "Dựng nhà từ đất phẳng bằng tay,|Từng viên gạch nhỏ đắp nên đầy.|Kiên nhẫn ngày qua thành sự nghiệp,|Nóng vội thì e đổ có ngày.",
    "Thành quả đến từ tích lũy từng bước. Không có đường tắt, kiên trì sẽ được đền đáp."),
  Q("Hạ Quẻ (Cẩn Trọng)", "ominous", "Quẻ Số 09: Vân Già Nguyệt Ám",
    "Mây đen che khuất ánh trăng thanh,|Lối cũ mờ đi chẳng rõ tranh.|Chớ vội tin lời người đường mật,|Chờ mây tan hết sẽ trời xanh.",
    "Có điều chưa rõ ràng quanh bạn. Cẩn thận với lời hứa suông và các khoản tiền, giấy tờ."),
  Q("Thượng Cát", "auspicious", "Quẻ Số 10: Song Phụng Triều Dương",
    "Đôi phượng cùng bay hướng nắng hồng,|Duyên lành se sợi chỉ tơ lòng.|Tâm đầu ý hợp nên đôi lứa,|Hạnh phúc tròn đầy sáng cõi trong.",
    "Duyên phận tốt đẹp, thuận cho tình cảm, hôn nhân và hợp tác với người tâm đầu ý hợp."),
  Q("Trung Bình", "neutral", "Quẻ Số 11: Lão Tùng Đón Tuyết",
    "Tùng già đứng vững giữa trời sương,|Gió lạnh qua rồi nắng ấm vương.|Bền chí giữ mình qua thử thách,|Sương tan thêm vững rễ bên đường.",
    "Đang trong giai đoạn thử thách nhưng nền tảng của bạn vững. Giữ bình tĩnh là đủ vượt qua."),
  Q("Cát", "auspicious", "Quẻ Số 12: Cửu Thiên Huyền Nữ",
    "Tiên nữ trời cao hạ phúc lành,|Trao người hiền đức dạ trong lành.|Giúp người người lại giúp mình lại,|Của cải nhà an, phúc ngập tràn.",
    "Làm việc thiện, giúp đỡ người khác sẽ mang lại may mắn trở lại. Quý nhân thường là phụ nữ hiền hậu."),
  Q("Hạ Quẻ (Cẩn Trọng)", "ominous", "Quẻ Số 13: Phong Vũ Mãn Thành",
    "Gió mưa dồn dập khắp đô thành,|Cửa đóng then cài giữ mệnh mình.|Đừng nên tranh cãi cùng thiên hạ,|Nhẫn nhịn qua cơn lại thái bình.",
    "Dễ gặp thị phi, tranh chấp. Nhường một bước, tránh xung đột, không ký kết gấp."),
  Q("Thượng Thượng Cát", "auspicious", "Quẻ Số 14: Đại Bằng Triển Sí",
    "Đại bằng giương cánh vút chín tầng,|Vạn dặm trời xa chẳng ngại ngần.|Chí lớn hùng tâm nay đắc thế,|Bốn phương danh tiếng khắp xa gần.",
    "Cơ hội lớn mở ra, thích hợp thăng tiến, mở rộng hoặc đi xa phát triển. Hãy dám bước."),
  Q("Trung Bình", "neutral", "Quẻ Số 15: Thủy Chung Hữu Thủy",
    "Nước chảy về đâu cũng có nguồn,|Đầu xuôi đuôi lọt khỏi lo buồn.|Việc nào có trước thì nên giữ,|Giữ nghĩa giữ tình mới trọn vuông.",
    "Hãy hoàn tất việc dang dở trước khi bắt đầu việc mới. Giữ chữ tín với người cũ."),
  Q("Cát", "auspicious", "Quẻ Số 16: Mãn Nguyệt Đoàn Viên",
    "Trăng rằm tròn vạn nhà sum họp,|Cha mẹ con cái ấm một nhà.|Hòa thuận trong ngoài đều yên ổn,|Phúc lộc theo về, tuổi thọ già.",
    "Gia đạo yên vui, sức khỏe người thân tốt. Thời điểm tốt để sum họp, sửa sang nhà cửa."),
  Q("Hạ Quẻ (Cẩn Trọng)", "ominous", "Quẻ Số 17: Lộ Tẩu Gai Chông",
    "Đường dài gai góc phủ chông gai,|Bước chân chậm lại chớ vội ngay.|Tìm người dẫn lối cùng nương tựa,|Qua được đoạn này sáng lắm thay.",
    "Trước mắt có trở ngại, đừng cố đi một mình. Nhờ người có kinh nghiệm chỉ dẫn."),
  Q("Trung Bình", "neutral", "Quẻ Số 18: Nhàn Vân Dã Hạc",
    "Mây nhàn hạc nội thong dong bước,|Thế sự mặc cho trời đất xoay.|Biết đủ là vui, vui chính thật,|Giữ lòng thanh thản, tự an vầy.",
    "Không phải lúc tranh giành. Nghỉ ngơi, chăm sóc sức khỏe và tinh thần để lấy lại sức."),
  Q("Thượng Cát", "auspicious", "Quẻ Số 19: Tụ Bảo Bồn Mãn",
    "Chậu quý đầy vơi của cải về,|Tay không dựng nghiệp thỏa lòng mê.|Cần kiệm chăm lo ngày một ít,|Mai sau phú quý ắt đề huề.",
    "Tài lộc khởi sắc, đặc biệt từ sự cần mẫn. Thuận cho tiết kiệm, đầu tư dài hạn an toàn."),
  Q("Cát", "auspicious", "Quẻ Số 20: Quý Nhân Tương Trợ",
    "Giữa đường gặp bạn đỡ tay nâng,|Khó khăn nhẹ gánh bước thêm chân.|Biết ơn người giúp mình đền đáp,|Phúc đức nhà ta sống vững lâu.",
    "Sắp có người giúp đỡ đúng lúc. Hãy cởi mở, biết ơn và sẵn sàng giúp lại người khác."),
];

export function drawFortuneStick(excludeId) {
  let pool = FORTUNE_DATABASE;
  if (excludeId) pool = pool.filter((f) => f.title !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)];
}

// ===== LUẬN THEO CHỦ ĐỀ =====
export const TOPICS = {
  tong: { label: "Tổng quát" },
  tinhduyen: { label: "Tình duyên" },
  sunghiep: { label: "Sự nghiệp" },
  taiLoc: { label: "Tài lộc" },
  suckhoe: { label: "Sức khỏe" },
  hoctap: { label: "Học tập thi cử" },
};

const TOPIC_ADVICE = {
  tong: {
    auspicious: "Vận khí chung đang lên, hãy chủ động nắm bắt cơ hội.",
    neutral: "Mọi việc ở mức ổn định, hãy giữ nhịp đều và đừng vội.",
    ominous: "Nên chậm lại, giữ mình, tránh quyết định lớn lúc này.",
  },
  tinhduyen: {
    auspicious: "Duyên lành đang đến gần, hãy chân thành và cởi mở lòng mình.",
    neutral: "Tình cảm cần thời gian. Quan tâm đúng lúc hơn là thúc ép.",
    ominous: "Dễ hiểu lầm, nên nói rõ ràng và tránh giận dỗi bốc đồng.",
  },
  sunghiep: {
    auspicious: "Thích hợp đề xuất ý tưởng, xin thăng tiến hoặc nhận dự án mới.",
    neutral: "Hoàn thiện kỹ năng, củng cố vị trí hiện tại sẽ có lợi hơn nhảy việc.",
    ominous: "Tránh xung đột nơi làm việc, kiểm tra kỹ hợp đồng trước khi ký.",
  },
  taiLoc: {
    auspicious: "Tài lộc khá, có thể đầu tư vừa sức nhưng đừng quên dự phòng.",
    neutral: "Thu chi cân bằng, nên tiết kiệm đều đặn hơn là đầu cơ.",
    ominous: "Hạn chế vay mượn, cho vay và đầu tư rủi ro cao trong thời gian này.",
  },
  suckhoe: {
    auspicious: "Thể trạng tốt, duy trì ăn ngủ điều độ và vận động nhẹ nhàng.",
    neutral: "Chú ý nghỉ ngơi đủ, đừng thức khuya kéo dài.",
    ominous: "Cẩn thận mệt mỏi, căng thẳng, nên đi khám nếu có dấu hiệu bất thường.",
  },
  hoctap: {
    auspicious: "Trí nhớ minh mẫn, ôn tập đúng trọng tâm sẽ gặt kết quả tốt.",
    neutral: "Cần kiên trì, ôn đều mỗi ngày thay vì dồn sát ngày thi.",
    ominous: "Dễ phân tâm, nên chia nhỏ mục tiêu và nhờ thầy cô, bạn bè hỗ trợ.",
  },
};

export function getTopicAdvice(type, topic = "tong") {
  return (TOPIC_ADVICE[topic] || TOPIC_ADVICE.tong)[type] || "";
}

// ===== XEM TUỔI =====
const THIEN_CAN = ["Canh", "Tân", "Nhâm", "Quý", "Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ"];
const DIA_CHI = ["Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi"];
// [con giáp, biểu tượng, tam hợp, xung]
const ZODIAC = [
  ["Khỉ", "🐒", "Tý, Thìn", "Dần"], ["Gà", "🐓", "Tỵ, Sửu", "Mão"],
  ["Chó", "🐕", "Dần, Ngọ", "Thìn"], ["Heo", "🐖", "Mão, Mùi", "Tỵ"],
  ["Chuột", "🐀", "Thân, Thìn", "Ngọ"], ["Trâu", "🐂", "Tỵ, Dậu", "Mùi"],
  ["Hổ", "🐅", "Ngọ, Tuất", "Thân"], ["Mèo", "🐈", "Hợi, Mùi", "Dậu"],
  ["Rồng", "🐉", "Thân, Tý", "Tuất"], ["Rắn", "🐍", "Dậu, Sửu", "Hợi"],
  ["Ngựa", "🐎", "Dần, Tuất", "Tý"], ["Dê", "🐐", "Hợi, Mão", "Sửu"],
];

const NGU_HANH = {
  1: { short: "Kim", name: "Kim (Vàng son sắc bén)", color: "#f3e5ab", trait: "Quyết đoán, sắc sảo, có tư duy tổ chức và kỷ luật cao.", lucky: "Trắng, ghi, vàng ánh kim", nums: "4, 9 và 6, 7" },
  2: { short: "Thủy", name: "Thủy (Nước nguồn linh hoạt)", color: "#38bdf8", trait: "Thông tuệ, giao tiếp khéo léo, thích nghi tuyệt vời.", lucky: "Xanh dương, đen, trắng", nums: "1, 6 và 0, 7" },
  3: { short: "Hỏa", name: "Hỏa (Lửa hồng nhiệt huyết)", color: "#e8553f", trait: "Sáng tạo, năng động, dám nghĩ dám làm và truyền cảm hứng.", lucky: "Đỏ, cam, hồng, tím", nums: "2, 7 và 3, 4" },
  4: { short: "Thổ", name: "Thổ (Đất lành vững chãi)", color: "#d97706", trait: "Điềm đạm, trọng chữ tín, kiên định và là chỗ dựa đáng tin.", lucky: "Vàng đất, nâu, đỏ, cam", nums: "2, 5, 8 và 9" },
  5: { short: "Mộc", name: "Mộc (Cây cổ thụ vươn cao)", color: "#2e8b57", trait: "Nhân hậu, cầu tiến, giàu sức sống và luôn hướng tới phát triển.", lucky: "Xanh lá, xanh dương, đen", nums: "3, 4 và 1, 6" },
};

// Cung phi (Bát Trạch): quái, nhóm, hướng tốt
const QUAI = {
  1: ["Khảm", "Đông Tứ Mệnh", "Bắc, Đông, Đông Nam, Nam"],
  2: ["Khôn", "Tây Tứ Mệnh", "Tây Nam, Tây Bắc, Tây, Đông Bắc"],
  3: ["Chấn", "Đông Tứ Mệnh", "Đông, Bắc, Nam, Đông Nam"],
  4: ["Tốn", "Đông Tứ Mệnh", "Đông Nam, Nam, Bắc, Đông"],
  6: ["Càn", "Tây Tứ Mệnh", "Tây Bắc, Tây, Đông Bắc, Tây Nam"],
  7: ["Đoài", "Tây Tứ Mệnh", "Tây, Tây Bắc, Tây Nam, Đông Bắc"],
  8: ["Cấn", "Tây Tứ Mệnh", "Đông Bắc, Tây Nam, Tây, Tây Bắc"],
  9: ["Ly", "Đông Tứ Mệnh", "Nam, Đông, Đông Nam, Bắc"],
};

const reduce9 = (n) => { while (n > 9) n = String(n).split("").reduce((a, b) => a + +b, 0); return n; };

function cungPhi(year, gender) {
  const s = reduce9(year % 100 === 0 ? 0 : reduce9((year % 100)));
  let k = year >= 2000
    ? (gender === "nam" ? 9 - s : 6 + s)
    : (gender === "nam" ? 10 - s : 5 + s);
  k = reduce9(k <= 0 ? k + 9 : k);
  if (k === 5) k = gender === "nam" ? 2 : 8;
  return QUAI[k];
}

export function calculateAgeDestiny(birthYear, gender = "nam") {
  const canIndex = birthYear % 10;
  const chiIndex = birthYear % 12;
  const canVal = [4, 4, 5, 5, 1, 1, 2, 2, 3, 3][canIndex];
  const chiVal = [1, 1, 2, 2, 0, 0, 1, 1, 2, 2, 0, 0][chiIndex];
  let sum = canVal + chiVal;
  if (sum > 5) sum -= 5;
  const [animal, emoji, tamHop, xung] = ZODIAC[chiIndex];
  const [quai, nhom, huong] = cungPhi(birthYear, gender);
  return {
    birthYear,
    canChi: `${THIEN_CAN[canIndex]} ${DIA_CHI[chiIndex]}`,
    animal, emoji, tamHop, xung,
    element: NGU_HANH[sum],
    quai, nhom, huong,
    age: new Date().getFullYear() - birthYear + 1,
  };
}

// ===== LUẬN CUNG TỬ VI =====
const THEMES = {
  Dan: "vận mệnh bản thân", Mao: "quan hệ với cha mẹ", Thin: "đời sống tinh thần",
  Ty_1: "nhà cửa, đất đai", Ngo: "công danh sự nghiệp", Mui: "quan hệ bạn bè, đồng nghiệp",
  Than: "việc đi xa, môi trường mới", Dau: "sức khỏe", Tuat: "tiền bạc, tài chính",
  Hoi: "con cái, hậu vận", Ti: "tình duyên, hôn nhân", Suu: "tình cảm anh chị em",
};
const STANCES = {
  auspicious: ["Về {t}, sao sáng chiếu cung, năm nay có tin vui.", "Về {t}, được quý nhân phù trợ, nên mạnh dạn hành động."],
  neutral: ["Về {t}, vận bình hòa, giữ nếp cũ và chăm chút thêm là đủ.", "Về {t}, có tốt có xấu đan xen, cần xem xét kỹ trước khi quyết."],
  ominous: ["Về {t}, có sao hạn nhẹ chiếu, nên cẩn trọng và nhường nhịn.", "Về {t}, dễ gặp trục trặc nhỏ, nhưng biết phòng ngừa sẽ hóa giải."],
};

export function getPalaceReading(key) {
  const r = Math.random();
  const mood = r < 0.45 ? "auspicious" : r < 0.8 ? "neutral" : "ominous";
  const list = STANCES[mood];
  const text = list[Math.floor(Math.random() * list.length)].replace("{t}", THEMES[key] || "cung này");
  return { mood, text };
}
