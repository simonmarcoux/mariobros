export function createDashboardLayer(font) {
    return function drawDashboardRect(context) {
        font.draw('A', context, 0, 0);
    }
}