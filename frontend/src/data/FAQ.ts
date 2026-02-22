interface FAQ {
  question: string;
  answer: string;
}

export const FAQ_DATA: FAQ[] = [
  {
    question: 'What file formats does OGV support?',
    answer: `There are multiple file formats that OGV supports. Input Formats: .obj, .ply, .vrml, .3mf, .asc, .x, .x3d, .3ds, .fbx, .assbin, .g.
       Output Formats: .obj, .stl, .ply, .vrml, .3mf, .asc, .x, .x3d, .3ds, .dae, .fbx, .json, .assbin, .g.`,
  },
  {
    question: 'Do I need to install anything?',
    answer:
      'No installation required — OGV works entirely in the browser. Just upload your file, and you’re ready to go.',
  },
  {
    question: 'How long does it take to convert a file?',
    answer:
      'The time it takes to convert a file depends on the size of the file. The larger the file, the longer it will take to convert.',
  },
  {
    question: 'Can I download my converted files?',
    answer:
      'Yes! After conversion, you can download your model in different formats, or even download multiple files together in a zip.',
  },
  {
    question: ' Can I share my 3D models?',
    answer:
      'Absolutely. Each model comes with a shareable link. You can choose whether it’s public or private, and others can view it in 3D instantly.',
  },
];
