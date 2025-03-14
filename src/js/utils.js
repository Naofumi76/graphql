export function formatSize(size) {
    if (size >= 1e6) {
        return (Math.floor(size / 1e4) / 100).toFixed(2) + ' MB';
    } else if (size >= 1e3) {
        return (Math.floor(size / 10) / 100).toFixed(2) + ' KB';
    } else {
        return size + ' B';
    }
}