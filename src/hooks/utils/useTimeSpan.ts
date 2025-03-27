const useTimeSpan = () => {

    const convertToTimeSpan = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        const duration = `${hours.toString().padStart(2, "0")}:${remainingMinutes
          .toString()
          .padStart(2, "0")}:00`;

        return duration;
    }

    const convertToMinutes = (duration: string) => {
        const [hours, minutes] = duration.split(":");
        return parseInt(hours) * 60 + parseInt(minutes);
    }

    const convertToMinutesInString = (duration: string): string | null => {
        if(duration === "" || duration === undefined) return null;
        const [hours, minutes] = duration.split(":");
        return (parseInt(hours) * 60 + parseInt(minutes)).toString();
    }

    return {
        convertToTimeSpan,
        convertToMinutes,
        convertToMinutesInString
    };
};

export default useTimeSpan;