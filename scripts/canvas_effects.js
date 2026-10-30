/**
 * Module Hiệu Ứng Thị Giác (Interactive Particle Canvas)
 * Tạo các hạt linh khí vàng kim & tím huyền ảo trôi nổi, kết nối bằng đường mảnh
 * và tương tác đẩy nhẹ khi người dùng di chuyển chuột.
 */

export function initParticleCanvas(canvasSelector = "#particle-canvas") {
  const canvas = document.querySelector(canvasSelector);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Tọa độ chuột để tương tác với hạt
  const mouse = {
    x: null,
    y: null,
    radius: 130,
  };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Cấu hình danh sách hạt linh khí
  const particleCount = Math.min(75, Math.floor((width * height) / 18000));
  const colors = [
    "rgba(212, 175, 55, ",
    "rgba(243, 229, 171, ",
    "rgba(147, 112, 219, ",
  ];

  const particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.45,
    vy: -(Math.random() * 0.5 + 0.15), // Xu hướng bay nhẹ lên trên như khói trầm
    size: Math.random() * 2.4 + 0.8,
    baseAlpha: Math.random() * 0.55 + 0.25,
    pulseSpeed: Math.random() * 0.02 + 0.008,
    pulseAngle: Math.random() * Math.PI * 2,
    colorPrefix: colors[Math.floor(Math.random() * colors.length)],
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Cập nhật vị trí & độ nhấp nháy
      p.x += p.vx;
      p.y += p.vy;
      p.pulseAngle += p.pulseSpeed;
      const currentAlpha = p.baseAlpha + Math.sin(p.pulseAngle) * 0.2;

      // Vòng lặp biên màn hình
      if (p.y < -10) p.y = height + 10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      // Tương tác đẩy nhẹ khi trỏ chuột tiến lại gần
      if (mouse.x !== null && mouse.y !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          p.x += (dx / distance) * force * 1.6;
          p.y += (dy / distance) * force * 1.6;
        }
      }

      // Vẽ hạt phát sáng
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `${p.colorPrefix}${Math.max(0.1, currentAlpha).toFixed(2)})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#d4af37";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Vẽ dây tơ linh khí nối các hạt gần nhau
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const lineAlpha = (1 - dist / 110) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(212, 175, 55, ${lineAlpha.toFixed(3)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}
