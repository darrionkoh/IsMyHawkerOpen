// SG Date parser
export const parseSGDate = (dateStr) => {
  if (!dateStr || dateStr === "NA" || dateStr === "nil" || dateStr === "TBC") return null;
  const [day, month, year] = dateStr.split('/');
  return new Date(year, month - 1, day);
};

// Check if hawker is closed today and return display date.
export const checkIsClosed = (closure, today) => {
  if (!closure) return { status: "open", displayDate: "No cleaning scheduled" };

  // Check other works
  const otherStart = parseSGDate(closure.other_works_startdate);
  const otherEnd = parseSGDate(closure.other_works_enddate);
  const otherRemarks = closure.remarks_other_works !== "nil" ? closure.remarks_other_works : "Other Works";

  if (otherStart && otherEnd) {
    if (today >= otherStart && today <= otherEnd) {
      return { 
        status: "closed", 
        displayDate: `${otherRemarks}: Until ${closure.other_works_enddate}` 
      };
    }
    
    // Upcoming other works check 
    const diffTime = otherStart - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 2 && diffDays > 0) {
      return { 
        status: "warning", 
        displayDate: `Upcoming: ${otherRemarks} (${closure.other_works_startdate})` 
      };
    }
  }

  // Check cleaning schedule
  const quarters = [
    { start: closure.q1_cleaningstartdate, end: closure.q1_cleaningenddate },
    { start: closure.q2_cleaningstartdate, end: closure.q2_cleaningenddate },
    { start: closure.q3_cleaningstartdate, end: closure.q3_cleaningenddate },
    { start: closure.q4_cleaningstartdate, end: closure.q4_cleaningenddate }
  ];

  const currentOrFuture = quarters.find(q => {
    const startDate = parseSGDate(q.start);
    if (!startDate) return false;
    const endDate = parseSGDate(q.end);
    if (today >= startDate && today <= endDate) return true;
    return startDate > today;
  });

  if (!currentOrFuture) return { status: "open", displayDate: "No cleaning scheduled" };

  const startDate = parseSGDate(currentOrFuture.start);
  const endDate = parseSGDate(currentOrFuture.end);

  if (today >= startDate && today <= endDate) {
    return { 
      status: "closed", 
      displayDate: `Cleaning: ${currentOrFuture.start} - ${currentOrFuture.end}` 
    };
  }

  const diffTime = startDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 2 && diffDays > 0) {
    return { 
      status: "warning", 
      displayDate: `Cleaning Soon: ${currentOrFuture.start}` 
    };
  }

  return { 
    status: "open", 
    displayDate: `Next Cleaning: ${currentOrFuture.start}` 
  };
};