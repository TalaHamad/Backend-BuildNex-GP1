export const getHumanReadableTimeDifference = (date) => {
    const now = new Date();
    const then = new Date(date);
    const secondsPast = (now.getTime() - then.getTime()) / 1000;
  
    if (secondsPast < 60) { // less than a minute
      return `${Math.round(secondsPast)} seconds ago`;
    } else if (secondsPast < 3600) { // less than an hour
      return `${Math.round(secondsPast / 60)} minutes ago`;
    } else if (secondsPast < 86400) { // less than a day
      const hours = Math.floor(secondsPast / 3600);
      const minutes = Math.round((secondsPast % 3600) / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else { // more than a day
      const days = Math.floor(secondsPast / 86400);
      const hours = Math.round((secondsPast % 86400) / 3600);
      return `${days} day${days > 1 ? 's' : ''} and ${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
  };