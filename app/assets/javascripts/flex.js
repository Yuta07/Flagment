var $grid = $('.pro-box'),
    emptyCells = [],
    i;

// 子パネル (ul.cell) の数だけ空の子パネル (ul.cell.is-empty) を追加する。
for (i = 0; i < $grid.find('.cell').length; i++) {
    emptyCells.push($('<ul>', { class: 'cell is-empty' }));
}

$grid.append(emptyCells);
