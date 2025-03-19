const fs = require('fs');
const path = require('path');

// Read the lessons.json file
const lessonsJsonPath = path.join(process.cwd(), 'lessons.json');
const lessonsData = JSON.parse(fs.readFileSync(lessonsJsonPath, 'utf8'));

// Function to scan directory structure and extract language information
function scanDirectoryStructure() {
  const rootDir = process.cwd();
  const decades = fs.readdirSync(rootDir)
    .filter(dir => /^\d{4}s$/.test(dir) && fs.statSync(path.join(rootDir, dir)).isDirectory());

  console.log(`Found decades: ${decades.join(', ')}`);
  
  const lessonsInfo = [];

  // decades
  for (const decade of decades) {
    const decadePath = path.join(rootDir, decade);
    const years = fs.readdirSync(decadePath)
      .filter(dir => /^\d{4}$/.test(dir) && fs.statSync(path.join(decadePath, dir)).isDirectory());
    
    console.log(`Found years in ${decade}: ${years.join(', ')}`);

    // years
    for (const year of years) {
      const yearPath = path.join(decadePath, year);
      const quarters = fs.readdirSync(yearPath)
        .filter(dir => /^q[1-4]$/.test(dir.toLowerCase()) && fs.statSync(path.join(yearPath, dir)).isDirectory());
      
      console.log(`Found quarters in ${year}: ${quarters.join(', ')}`);

      // quarters
      for (const quarter of quarters) {
        const quarterPath = path.join(yearPath, quarter);
        const languages = fs.readdirSync(quarterPath)
          .filter(dir => fs.statSync(path.join(quarterPath, dir)).isDirectory());
        
        console.log(`Found languages in ${year}/${quarter}: ${languages.join(', ')}`);

        // Count weeks in the first language directory (assuming all languages have the same number of weeks)
        const firstLangPath = path.join(quarterPath, languages[0]);
        const weeks = fs.readdirSync(firstLangPath)
          .filter(file => /^week-\d+\.md$/.test(file)).length;
        
        console.log(`Found ${weeks} weeks in ${year}/${quarter}/${languages[0]}`);

        // Add to lessons info
        lessonsInfo.push({
          year: parseInt(year),
          quarter: `Q${quarter.charAt(1).toUpperCase()}`,
          languages: languages,
          weeks: weeks
        });
      }
    }
  }

  return lessonsInfo;
}

// Update lessons.json with language information
function updateLessonsJson(lessonsInfo) {
  const lessons = lessonsData.lessons;

  for (const info of lessonsInfo) {
    const lesson = lessons.find(l => 
      l.year === info.year && 
      l.quarter.toLowerCase().includes(info.quarter.toLowerCase())
    );

    if (lesson) {
      lesson.languages = info.languages;
      lesson.weeks = info.weeks;
      console.log(`Updated lesson: ${lesson.title} (${lesson.year} ${lesson.quarter}) with languages: ${info.languages.join(', ')}`);
    } else {
      console.log(`No matching lesson found for ${info.year} ${info.quarter}`);
    }
  }

  // Write updated lessons.json
  fs.writeFileSync(lessonsJsonPath, JSON.stringify(lessonsData, null, 2));
  console.log('Updated lessons.json');
}

try {
  const lessonsInfo = scanDirectoryStructure();
  updateLessonsJson(lessonsInfo);
  console.log('Successfully updated lessons.json with language information');
} catch (error) {
  console.error('Error updating lessons.json:', error);
  process.exit(1);
}