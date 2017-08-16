client.getEntries().then(function(data){

    const types = data.items.reduce(function(types, item){
        const type = item.sys.contentType.sys.id;
        if (type === 'newsItem') types.push(item);
        return types
    },[]);
    console.log(types)
});

client.getEntries({
    content_type: 'newsItem'
}).then(function(news){
    news.items.sort(function(a, b){
        const dA = new Date(a.fields.displayDate).getTime();
        const dB = new Date(b.fields.displayDate).getTime();
        if (dB < dA) {
            return -1;
        } else if (dA < dB) {
            return 1;
        } else {
            return 0
        }
    });
    return news;
}).then(log);
