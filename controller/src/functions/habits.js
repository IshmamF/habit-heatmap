export async function fetchHabits(username) {
    try {
      const response = await fetch('https://habit-heatmap-api-d98a01d08072.herokuapp.com/api/v1/getHabits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "username": username }),
      });
      const data = await response.json();
      return data.result.habits;
    } catch (error) {
      console.error(error);
      return [];
    }
}
 
export function getHabitOptions(habits) {
if (!habits || habits.length === 0) {
    return <option value="none">No habits found</option>;
}
return habits.map((habit, index) => (
    <option key={index} value={habit.habitName}>{habit.habitName}</option>
));
}

export function selectedHabitDetails(habitName, habits) {
    if (!habits || habits.length === 0) {
        return {};
    } else if (habitName === "select") {
        return {"habitName": "Select a habit", "metric": "Select a habit", "color": "Select a habit"};
    } else {
        return habits.find((habit) => habit.habitName === habitName);
    }
}                 