from datetime import datetime


def get_recent_habits(data):
    all_metrics = []
    for habit in data:
        for metric in habit['data']:
            metric_data = metric.copy()  
            metric_data['habitName'] = habit['habitName']
            metric_data['metric'] = habit['metric']
            all_metrics.append(metric_data)
    
    return sorted(all_metrics, key=lambda x: datetime.strptime(x['date'], "%Y/%m/%d"), reverse=True)


def get_most_recent_data(data, number=3):
    return get_recent_habits(data)[:number]

def get_most_recent_active_notes(data, number=3):
    recent_habits = get_recent_habits(data)
    return [metric for metric in recent_habits if metric['note'] != ""][:number]

