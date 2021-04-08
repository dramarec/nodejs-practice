const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'usd',
        style: 'currency',
    }).format(price);
};
const toDate = date => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date(date));
};

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent);
});
document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent);
});
const $price = document.querySelector('#price');

const $card = document.querySelector('#card');
if ($card) {
    $card.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id;
            console.log('id ===> ', id);

            fetch('/card/remove/' + id, {
                method: 'delete',
            })
                .then(res => res.json())
                .then(card => {
                    if (card.courses.length) {
                        const html = card.courses
                            .map(item => {
                                return `
                                <tr>
                                    <td>${item.title}</td>
                                    <td>${item.count}</td>
                                    <td>
                                    <button class="btn btm-small js-remove" data-id="${item._id}">Удалить</button>
                                    </td>
                                </tr>
                                `;
                            })
                            .join('');
                        $card.querySelector('tbody').innerHTML = html;
                        $card.querySelector('.price').textContent = toCurrency(
                            card.price,
                        );
                    } else {
                        $card.innerHTML = '<p>Корзина пуста</p>';
                    }
                });
        }
    });
}
M.Tabs.init(document.querySelectorAll('.tabs'));
