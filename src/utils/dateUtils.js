// src/utils/dateUtils.js
export const formatHijriMonth = (monthNumber) => {
  const hijriMonths = {
    1: 'محرم', 2: 'صفر', 3: 'ربيع الأول', 4: 'ربيع الآخر',
    5: 'جمادى الأولى', 6: 'جمادى الآخرة', 7: 'رجب',
    8: 'شعبان', 9: 'رمضان', 10: 'شوال',
    11: 'ذو القعدة', 12: 'ذو الحجة'
  };
  return hijriMonths[monthNumber] || monthNumber;
};

export const formatGregorianMonth = (monthNumber) => {
  const gregorianMonths = {
    1: 'يناير', 2: 'فبراير', 3: 'مارس', 4: 'أبريل',
    5: 'مايو', 6: 'يونيو', 7: 'يوليو', 8: 'أغسطس',
    9: 'سبتمبر', 10: 'أكتوبر', 11: 'نوفمبر', 12: 'ديسمبر'
  };
  return gregorianMonths[monthNumber] || monthNumber;
};