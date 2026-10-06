const fs = require('fs');
let code = fs.readFileSync('src/app/api/boards/[roleId]/route.ts', 'utf8');
code = code.replace(
  /if \(existingBoard && existingBoard\.layers\.length > 0\) \{\s*return NextResponse\.json\(existingBoard\);\s*\}/,
  `if (existingBoard && existingBoard.layers.length > 0) {
      if (roleId === 'role-ophelia-demo') {
         // Force delete the old one to rebuild
         await prisma.layer.deleteMany({ where: { boardId: existingBoard.id } });
         await prisma.edge.deleteMany({ where: { boardId: existingBoard.id } });
         await prisma.board.delete({ where: { id: existingBoard.id } });
      } else {
         return NextResponse.json(existingBoard);
      }
    }`
);
fs.writeFileSync('src/app/api/boards/[roleId]/route.ts', code);
