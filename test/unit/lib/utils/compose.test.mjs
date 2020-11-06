import tap from 'tap';
import compose from '../../../../lib/utils/compose.mjs';

tap.test('compose', tap => {
  tap.test('when using compose', tap => {
    tap.plan(3);

    const divideBy100 = num => num / 100;
    const roundTo2decimals = num => parseFloat(num).toFixed(2);
    const dotToComma = str => String(str).replace('.', ',');
    const addSeparators = str => String(str).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const addCurrency = str => String(str) + " €";

    const formatCentsAsEuro = num =>
      addCurrency(
        addSeparators(
          dotToComma(
            roundTo2decimals(
              divideBy100(num)
            )
          )
        )
      );
    const formatCentsAsEuroComposed = compose(addCurrency, addSeparators, dotToComma, roundTo2decimals, divideBy100)

    tap.strictEqual(typeof formatCentsAsEuroComposed, 'function', 'compose should return a function');
    tap.strictEqual(formatCentsAsEuroComposed(1234567890), '12.345.678,90 €', 'should return correct result');
    tap.strictEqual(formatCentsAsEuroComposed(1234567890), formatCentsAsEuro(1234567890), 'should return same result as called one by one');
    tap.end();
  });
  tap.end();
})
