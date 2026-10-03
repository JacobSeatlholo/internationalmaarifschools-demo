/**
 * Seed script — populates the ERP with a realistic Term 4, 2026 dataset.
 * Run: bun scripts/seed.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const iso = (d: Date) => d.toISOString().slice(0, 10);
const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

async function main() {
  console.log("Clearing existing data…");
  await db.directiveSignOff.deleteMany();
  await db.directive.deleteMany();
  await db.substituteDispatch.deleteMany();
  await db.timetableEntry.deleteMany();
  await db.leaveRequest.deleteMany();
  await db.leaveBalance.deleteMany();
  await db.doctorNote.deleteMany();
  await db.academicRecord.deleteMany();
  await db.showcaseProject.deleteMany();
  await db.payment.deleteMany();
  await db.feeAccount.deleteMany();
  await db.student.deleteMany();
  await db.receipt.deleteMany();
  await db.task.deleteMany();
  await db.meeting.deleteMany();
  await db.application.deleteMany();
  await db.staff.deleteMany();

  // ── STAFF ─────────────────────────────────────────────
  console.log("Seeding staff…");
  const staff = await Promise.all(
    [
      { name: "Dr. Emre Aydın", role: "PRINCIPAL", department: "ADMIN", email: "principal@maarifct.co.za", hpcsaNumber: null, subjects: [] },
      { name: "Fatima Vawda", role: "BURSAR", department: "ADMIN", email: "bursar@maarifct.co.za", hpcsaNumber: null, subjects: [] },
      { name: "Mehmet Kaya", role: "EXECUTIVE", department: "ADMIN", email: "exec@maarifct.co.za", hpcsaNumber: null, subjects: [] },
      { name: "Thandiwe Mbeki", role: "DEPT_HEAD", department: "SCIENCES", email: "t.mbeki@maarifct.co.za", hpcsaNumber: null, subjects: ["Physical Sciences", "Life Sciences"] },
      { name: "Jaco van Wyk", role: "DEPT_HEAD", department: "MATHEMATICS", email: "j.vanwyk@maarifct.co.za", hpcsaNumber: null, subjects: ["Mathematics", "AS-Level Mathematics"] },
      { name: "Sarah Petersen", role: "TEACHER", department: "LANGUAGES", email: "s.petersen@maarifct.co.za", hpcsaNumber: null, subjects: ["English Home Language"] },
      { name: "Ahmet Demir", role: "TEACHER", department: "SCIENCES", email: "a.demir@maarifct.co.za", hpcsaNumber: null, subjects: ["Physics", "Robotics & Coding"] },
      { name: "Nomvula Dlamini", role: "TEACHER", department: "HUMANITIES", email: "n.dlamini@maarifct.co.za", hpcsaNumber: null, subjects: ["History", "Geography"] },
      { name: "Riadh Isaacs", role: "TEACHER", department: "MATHEMATICS", email: "r.isaacs@maarifct.co.za", hpcsaNumber: null, subjects: ["Mathematics", "Accounting"] },
      { name: "Lindiwe Khumalo", role: "TEACHER", department: "SCIENCES", email: "l.khumalo@maarifct.co.za", hpcsaNumber: null, subjects: ["Life Sciences", "Natural Sciences"] },
      { name: "Zainep Yılmaz", role: "TEACHER", department: "LANGUAGES", email: "z.yilmaz@maarifct.co.za", hpcsaNumber: null, subjects: ["Turkish Language & Culture"] },
      { name: "Sipho Ndlovu", role: "TEACHER", department: "SPORT", email: "s.ndlovu@maarifct.co.za", hpcsaNumber: null, subjects: ["Life Orientation", "Sports Performance"] },
    ].map((s) =>
      db.staff.create({
        data: {
          name: s.name,
          role: s.role,
          department: s.department,
          email: s.email,
          phone: `0${Math.floor(600000000 + Math.random() * 99999999)}`,
          hpcsaNumber: s.hpcsaNumber,
          subjects: JSON.stringify(s.subjects),
        },
      })
    )
  );

  const teacherByName = Object.fromEntries(staff.map((s) => [s.name, s]));

  // ── TIMETABLE (periods 1-8, days 1-5) ────────────────
  console.log("Seeding timetable…");
  const teachingStaff = staff.filter((s) => s.role === "TEACHER" || s.role === "DEPT_HEAD");
  const periodSubjects = [
    "Mathematics", "Physical Sciences", "English Home Language", "Life Sciences",
    "Accounting", "History", "Robotics & Coding", "Life Orientation",
  ];
  for (const t of teachingStaff) {
    const subjects = JSON.parse(t.subjects) as string[];
    const base = subjects[0] ?? periodSubjects[0];
    for (let day = 1; day <= 5; day++) {
      for (let period = 1; period <= 8; period++) {
        // Each teacher teaches ~5 of 8 periods per day (free periods remain)
        if ((day * 8 + period + t.id.charCodeAt(t.id.length - 1)) % 3 === 0) continue;
        await db.timetableEntry.create({
          data: {
            staffId: t.id,
            day,
            period,
            subject: subjects.length > 1 && period % 2 === 0 ? subjects[1] : base,
            gradeClass: `Grade ${8 + ((day + period) % 5)}`,
          },
        });
      }
    }
  }

  // ── LEAVE BALANCES ───────────────────────────────────
  console.log("Seeding leave balances…");
  for (const s of staff) {
    await db.leaveBalance.create({
      data: {
        staffId: s.id,
        cycleStart: "2026-01-14",
        annualEntitlement: 15, annualTaken: s.role === "TEACHER" ? 4.5 : 2,
        sickEntitlement: 30, sickTaken: 2,
        familyEntitlement: 3, familyTaken: 1,
        studyEntitlement: 5, studyTaken: 0,
      },
    });
  }

  // ── LEAVE REQUESTS ───────────────────────────────────
  console.log("Seeding leave requests…");
  const ahmet = teacherByName["Ahmet Demir"];
  const sarah = teacherByName["Sarah Petersen"];
  const sipho = teacherByName["Sipho Ndlovu"];

  await db.leaveRequest.create({
    data: {
      staffId: ahmet.id,
      type: "SICK",
      startDate: iso(daysFromNow(2)),
      endDate: iso(daysFromNow(4)),
      workingDays: 3,
      reason: "Flu — medical certificate uploaded",
      status: "PENDING",
    },
  });
  await db.leaveRequest.create({
    data: {
      staffId: sarah.id,
      type: "ANNUAL",
      startDate: iso(daysFromNow(10)),
      endDate: iso(daysFromNow(14)),
      workingDays: 5,
      reason: "Family holiday (pre-booked)",
      status: "PENDING",
    },
  });
  await db.leaveRequest.create({
    data: {
      staffId: sipho.id,
      type: "FAMILY",
      startDate: iso(daysFromNow(-6)),
      endDate: iso(daysFromNow(-6)),
      workingDays: 1,
      reason: "Child's medical appointment",
      status: "APPROVED",
    },
  });
  await db.leaveRequest.create({
    data: {
      staffId: teacherByName["Nomvula Dlamini"].id,
      type: "STUDY",
      startDate: iso(daysFromNow(20)),
      endDate: iso(daysFromNow(21)),
      workingDays: 2,
      reason: "UNISA exam sittings",
      status: "PENDING",
    },
  });

  // ── DOCTOR'S NOTE (example pending verification) ─────
  const note = await db.doctorNote.create({
    data: {
      fileName: "med-cert-ahmet-demir.pdf",
      doctorName: "Dr. N. Pillay",
      practiceNumber: "MP 0412345",
      issuedDate: iso(daysFromNow(1)),
      unfitFrom: iso(daysFromNow(2)),
      unfitTo: iso(daysFromNow(4)),
      diagnosis: "Acute upper respiratory infection — unfit for work",
      hpcsaValid: true,
      ocrText:
        "MEDICAL CERTIFICATE\nDr. N. Pillay (MBChB UCT)\nPr No: MP 0412345\nDate: " +
        iso(daysFromNow(1)) +
        "\nPatient: A. Demir\nDiagnosis: Acute upper respiratory infection\nUnfit for work from " +
        iso(daysFromNow(2)) + " to " + iso(daysFromNow(4)) + " inclusive.",
      ocrConfidence: 0.96,
    },
  });
  await db.leaveRequest.create({
    data: {
      staffId: ahmet.id,
      type: "SICK",
      startDate: iso(daysFromNow(2)),
      endDate: iso(daysFromNow(4)),
      workingDays: 3,
      reason: "Flu — medical certificate attached",
      status: "PENDING",
      doctorNoteId: note.id,
    },
  });

  // ── STUDENTS + FEES ──────────────────────────────────
  console.log("Seeding students & fee ledger…");
  const students = [
    ["Aaliyah", "Ismail", "Grade 11", "11A", "DUAL", "Faldela Ismail", 75020, 75020, "FULLY_PAID", 0],
    ["Sesinibo", "Tau", "Grade 10", "10B", "CAPS", "Mandla Tau", 73920, 49280, "PARTIALLY_PAID", 0],
    ["Junaid", "Omar", "Grade 12", "12A", "CAMBRIDGE", "Gaironesa Omar", 80520, 73800, "PARTIALLY_PAID", 0],
    ["Merve", "Bahadir", "Grade 9", "9A", "DUAL", "Esra Bahadir", 68640, 68640, "FULLY_PAID", 0],
    ["Lwandle", "Mkhize", "Grade 8", "8A", "CAPS", "Bongiwe Mkhize", 66000, 39600, "IN_ARREARS", 34],
    ["Chloe", "Davids", "Grade 10", "10A", "CAPS", "Aneesa Davids", 73920, 73920, "FULLY_PAID", 0],
    ["Emihle", "Sogwata", "Grade 12", "12B", "CAPS", "Ntombekhaya Sogwata", 80520, 53680, "IN_ARREARS", 21],
    ["Esra", "Aydin", "Grade 8", "8B", "DUAL", "Fatih Aydin", 66000, 66000, "FULLY_PAID", 0],
    ["Muhammad", "Patel", "Grade 11", "11B", "CAMBRIDGE", "Yusuf Patel", 75020, 43750, "IN_ARREARS", 47],
    ["Anaisah", "Chan", "Grade 9", "9B", "CAPS", "Ayesha Chan", 68640, 34320, "PARTIALLY_PAID", 0],
  ] as const;

  for (const [first, last, grade, cls, pathway, guardian, tuition, paid, status, arrears] of students) {
    const student = await db.student.create({
      data: {
        firstName: first, lastName: last, grade, className: cls, pathway,
        guardianName: guardian, guardianPhone: `0${Math.floor(720000000 + Math.random() * 9999999)}`,
        guardianEmail: `${guardian.split(" ")[0].toLowerCase()}@example.co.za`,
      },
    });
    const account = await db.feeAccount.create({
      data: {
        studentId: student.id, annualTuition: tuition, paidToDate: paid,
        planType: status === "IN_ARREARS" ? "MONTHLY_11" : "PER_TERM_4",
        status, arrearsDays: arrears,
        lastPaymentAt: paid > 0 ? daysFromNow(-Math.floor(3 + Math.random() * 25)) : null,
      },
    });
    await db.payment.create({
      data: { feeAccountId: account.id, amount: paid, method: "EFT", reference: `EFT-${Math.floor(100000 + Math.random() * 899999)}` },
    });
  }

  // ── RECEIPTS (OCR results) ───────────────────────────
  console.log("Seeding OCR receipts…");
  await db.receipt.createMany({
    data: [
      { fileName: "bidvest-facilities-inv.pdf", merchant: "Bidvest Facilities", vatNumber: "4123456789", category: "FACILITIES", amount: 12450, documentDate: iso(daysFromNow(-3)), tier: "EXECUTIVE", status: "PENDING_APPROVAL", ocrConfidence: 0.97 },
      { fileName: "incredible-connection-toner.jpg", merchant: "Incredible Connection", vatNumber: "4987654321", category: "IT", amount: 2899, documentDate: iso(daysFromNow(-5)), tier: "AUTO", status: "AUTO_LOGGED", ocrConfidence: 0.91 },
      { fileName: "engen-fuel-slip.jpg", merchant: "Engen Claremont", vatNumber: "4055512345", category: "TRANSPORT", amount: 1250.5, documentDate: iso(daysFromNow(-1)), tier: "AUTO", status: "AUTO_LOGGED", ocrConfidence: 0.88 },
      { fileName: "lab-equipment-po.pdf", merchant: "LabChem Supplies", vatNumber: "4333444555", category: "ACADEMIC", amount: 18700, documentDate: iso(daysFromNow(-2)), tier: "EXECUTIVE", status: "PENDING_APPROVAL", ocrConfidence: 0.95 },
      { fileName: "canteen-groceries.pdf", merchant: "Food Lovers Market", vatNumber: "4222333444", category: "CANTEEN", amount: 4320.75, documentDate: iso(daysFromNow(-4)), tier: "AUTO", status: "AUTO_LOGGED", ocrConfidence: 0.93 },
      { fileName: "rejected-duplicate-inv.pdf", merchant: "Bidvest Facilities", vatNumber: "4123456789", category: "FACILITIES", amount: 12450, documentDate: iso(daysFromNow(-3)), tier: "EXECUTIVE", status: "REJECTED", ocrConfidence: 0.97 },
    ],
  });

  // ── TASKS (Kanban SLA) ───────────────────────────────
  console.log("Seeding tasks…");
  await db.task.createMany({
    data: [
      { title: "Replace B-lab roof guttering before winter rains", description: "Quote attached from RoofCo. Water ingress reported near server room.", tag: "FACILITIES", column: "IN_PROGRESS", assignee: "Facilities Team", priority: "HIGH", slaDueAt: iso(daysFromNow(2)) + "T17:00:00.000Z" },
      { title: "Q3 financial audit pack submission", description: "Consolidate receipts, payroll and fee variance report for the executive review.", tag: "FINANCIAL_AUDIT", column: "EXEC_REVIEW", assignee: "Fatima Vawda", priority: "CRITICAL", slaDueAt: iso(daysFromNow(-1)) + "T12:00:00.000Z", escalated: true },
      { title: "Grade 12 trial exam timetable", description: "Finalise invigilation roster and venue allocation.", tag: "CURRICULUM", column: "TODO", assignee: "Thandiwe Mbeki", priority: "MEDIUM", slaDueAt: iso(daysFromNow(6)) + "T17:00:00.000Z" },
      { title: "Inter-schools soccer fixture transport", description: "Book 2 buses for away fixture vs Pinelands High.", tag: "EVENTS", column: "TODO", assignee: "Sipho Ndlovu", priority: "LOW", slaDueAt: iso(daysFromNow(9)) + "T17:00:00.000Z" },
      { title: "New teacher onboarding — devices & signage", description: "Laptop, access cards and staff-room name board for incoming Physics intern.", tag: "HR", column: "IN_PROGRESS", assignee: "Admin Office", priority: "MEDIUM", slaDueAt: iso(daysFromNow(4)) + "T17:00:00.000Z" },
      { title: "Fire drill compliance inspection", description: "Quarterly evacuation drill with Claremont fire station observer.", tag: "FACILITIES", column: "DONE", assignee: "Facilities Team", priority: "HIGH", slaDueAt: iso(daysFromNow(-8)) + "T17:00:00.000Z", completedAt: daysFromNow(-9) },
      { title: "STREAM lab projector installation", description: "Ceiling-mount 4K unit in Robotics lab.", tag: "CURRICULUM", column: "DONE", assignee: "IT Support", priority: "MEDIUM", slaDueAt: iso(daysFromNow(-3)) + "T17:00:00.000Z", completedAt: daysFromNow(-4) },
    ],
  });

  // ── MEETINGS ─────────────────────────────────────────
  console.log("Seeding meetings…");
  await db.meeting.createMany({
    data: [
      { type: "PARENT_TEACHER", guardianName: "Bongiwe Mkhize", staffName: "Jaco van Wyk", topic: "Grade 8 mathematics intervention plan", scheduledAt: daysFromNow(1).toISOString(), room: "Maths Room 12" },
      { type: "EXECUTIVE", guardianName: "Gaironesa Omar", staffName: "Dr. Emre Aydın", topic: "Grade 12 university application support", scheduledAt: daysFromNow(2).toISOString(), room: "Principal's Office", attachment: "UCT-prospectus-2027.pdf" },
      { type: "PARENT_TEACHER", guardianName: "Yusuf Patel", staffName: "Thandiwe Mbeki", topic: "Physics trial-exam preparation", scheduledAt: daysFromNow(3).toISOString(), meetLink: "https://meet.google.com/maarif-phys-patel" },
    ],
  });

  // ── APPLICATIONS ─────────────────────────────────────
  console.log("Seeding applications…");
  await db.application.createMany({
    data: [
      { trackingCode: "IMS-CT-2026-0001", studentFirst: "Zara", studentLast: "Hendricks", dob: "2012-03-14", grade: "Grade 8", pathway: "DUAL", guardianFirst: "Rashied", guardianLast: "Hendricks", email: "rashied@example.co.za", phone: "0821234567", startTerm: "January 2027", heardFrom: "Word of mouth", status: "INTERVIEW" },
      { trackingCode: "IMS-CT-2026-0002", studentFirst: "Liam", studentLast: "van Reenen", dob: "2011-07-22", grade: "Grade 9", pathway: "CAMBRIDGE", guardianFirst: "Margot", guardianLast: "van Reenen", email: "m.vanreenen@example.co.za", phone: "0839876543", startTerm: "January 2027", heardFrom: "Website", status: "ASSESSMENT" },
      { trackingCode: "IMS-CT-2026-0003", studentFirst: "Amara", studentLast: "Naidoo", dob: "2010-11-02", grade: "Grade 10", pathway: "CAPS", guardianFirst: "Priya", guardianLast: "Naidoo", email: "priya.n@example.co.za", phone: "0845551234", startTerm: "January 2027", heardFrom: "Instagram", status: "SUBMITTED" },
    ],
  });

  // ── ACADEMIC RECORDS (portal demo student: Aaliyah Ismail) ──
  console.log("Seeding academic records…");
  const demoStudent = await db.student.findFirst({ where: { firstName: "Aaliyah" } });
  if (demoStudent) {
    const subjects = ["Mathematics", "Physical Sciences", "English Home Language", "Life Sciences", "Accounting", "Life Orientation"];
    const marks: Record<string, number[]> = {
      "T1 2026": [78, 71, 82, 75, 80, 88],
      "T2 2026": [81, 74, 84, 78, 83, 90],
      "T3 2026": [86, 79, 87, 83, 88, 92],
    };
    for (const [term, arr] of Object.entries(marks)) {
      for (let i = 0; i < subjects.length; i++) {
        await db.academicRecord.create({
          data: {
            studentId: demoStudent.id,
            term,
            subject: subjects[i],
            curriculum: subjects[i] === "Mathematics" || subjects[i] === "Physical Sciences" ? "CAMBRIDGE" : "CAPS",
            mark: arr[i],
            comment: arr[i] >= 85 ? "Distinction trajectory — maintain pace." : "Steady improvement; focus on past-paper technique.",
          },
        });
      }
    }
  }

  // ── SHOWCASE ─────────────────────────────────────────
  await db.showcaseProject.createMany({
    data: [
      { studentName: "Grade 11 Robotics Team", grade: "11", title: "Fire-fighting autonomous robot", subject: "Robotics & Coding", description: "Line-following robot with thermal sensor array — regional FIRST-style semi-finalists.", likes: 128 },
      { studentName: "Aaliyah Ismail", grade: "11", title: "Water quality study: Liesbeek River", subject: "Life Sciences", description: "Six-week longitudinal pH, turbidity and E. coli survey with GIS mapping.", likes: 87 },
      { studentName: "Junaid Omar", grade: "12", title: "A-Level mechanics: trebuchet optimisation", subject: "Physics", description: "Counterweight-to-range modelling validated with 40 launches — 98% model accuracy.", likes: 143 },
      { studentName: "Grade 9 STREAM Class", grade: "9", title: "Solar still desalination challenge", subject: "Natural Sciences", description: "Team-built solar stills producing 180ml potable water/day from brine.", likes: 64 },
    ],
  });

  // ── DIRECTIVES ───────────────────────────────────────
  console.log("Seeding directives…");
  const d1 = await db.directive.create({
    data: {
      title: "Term 4 Exam Invigilation Protocol",
      body: "All invigilators must be seated 15 minutes before sessions start. Phones sealed in the admin safe. Incident logs are due to the Principal within 24h of any irregularity.",
      authorRole: "EXECUTIVE",
      requiresSignOff: true,
    },
  });
  await db.directive.create({
    data: {
      title: "Fee Statement WhatsApp Template — v2",
      body: "Bursar office: use the updated template for all arrears statements. Include the EFT reference and the early-payment window. Log every send in the ledger notes.",
      authorRole: "BURSAR",
      requiresSignOff: true,
    },
  });
  await db.directiveSignOff.create({
    data: { directiveId: d1.id, staffName: "Fatima Vawda", role: "BURSAR" },
  });

  console.log("✔ Seed complete.");
  console.log(`   Staff: ${staff.length}`);
  console.log(`   Students: ${students.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
