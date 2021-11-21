const lib = require('./../testing-demo/lib');
const ex = require('./../testing-demo/exercise1');
const db = require('./../testing-demo/db');
const mail = require('./../testing-demo/mail');

test('absolute - return a positive number if input is +ve', () => {
    const res = lib.absolute(1);
    expect(res).toBe(1);
});

// grouping your test, enable cleaner code
describe('absolute', () => {
    it('return a positive number if input is +ve', () => {
        const res = lib.absolute(1);
        expect(res).toBe(1);
    });
    
    it('return a positive number if input is -ve', () => {
        const res = lib.absolute(+1);
        expect(res).toBe(1);
    });
    
    it('return 0 if input is 0', () => {
        const res = lib.absolute(0);
        expect(res).toBe(0);
    });
});

describe('greet', () => {
    it('should return greeting message', () => {
        const res = lib.greet('Emmanuel');
        // expect(res).toBe("Welcome Emmanuel");
        expect(res).toMatch(/Emmanuel/);
        expect(res).toContain("Welcome Emmanuel");
    });
});

describe('getProduct', () => {
    it('should return product with given ID', () => {
        const res = lib.getProduct(1);
        // expect(res).toBe({ id: 1, price: 10 }); don't use tobe if not in same memory, test will fail
        // expect(res).toEqual({ id: 1, price: 10 });
        expect(res).toMatchObject({ id: 1, price: 10 });
        expect(res).toHaveProperty("id", 1);
    });
});

describe('getCurrencies', () => {
    it('should return supported currencies', () => {
        const res = lib.getCurrencies();

        //Too general
        expect(res).toBeDefined();
        expect(res).not.toBeNull();

        //Too specific
        expect(res[0]).toBe('USD');
        expect(res[1]).toBe('AUD');
        expect(res[2]).toBe('EUR');
        expect(res.length).toBe(3);

        //Proper way
        expect(res).toContain('USD');
        expect(res).toContain('AUD');
        expect(res).toContain('EUR');

        //Ideal way to test for arrays
        expect(res).toEqual(expect.arrayContaining(['EUR', 'USD', 'AUD']));

    });
});

describe('registerUser', () => {
    it('should throw exception if username is falsy', () => {
        const args = [null, undefined, NaN, '', 0, false];
        args.forEach(arg => {
            expect(() => { lib.registerUser(arg) }).toThrow();
        })
    })

    it('should return a user object if a valid username is passed', () => {
        const res = lib.registerUser('emmanuel');
        expect(res).toMatchObject({ username: 'emmanuel' });
        expect(res.id).toBeGreaterThan(0);
    })
})

describe('fizzbuzz', () => {
    it('should throw exception if input is not a number', () => {
        const args = ['a', null, undefined, ''];
        args.forEach(arg => {
            expect(() => { ex.fizzBuzz(arg) }).toThrow()
        })
    });

    it('should return FizzBuzz if input is divisible by 3 and 5', () => {
        const res = ex.fizzBuzz(15);
        expect(res).toBe('FizzBuzz');
    });

    it('should return Fizz if input is divisible by 3', () => {
        const res = ex.fizzBuzz(3);
        expect(res).toBe('Fizz');
    });

    it('should return Buzz if input is divisible by 5', () => {
        const res = ex.fizzBuzz(5);
        expect(res).toBe('Buzz');
    });

    it('should return input if input is not divisible by 3 or 5', () => {
        const res = ex.fizzBuzz(1);
        expect(res).toBe(1);
    });
});

describe('apply discount', () => {
    it('should apply 10% discount if customer has more than 10points', () => {
        db.getCustomerSync = function(customerId) {
            console.log('fake customer reading...');
            return { id: customerId, points: 11 };
        }

        const order = { customerId: 1, totalPrice: 10 };
        lib.applyDiscount(order);
        expect(order.totalPrice).toBe(9);
    });
});

describe('nofifyCustomer', () => {
    it('should send an email', () => {
        db.getCustomerSync = function(customerId) {
            return { email: 'a' };
        }
        let mailSent = false;
        mail.send = function(email, message) {
            mailSent = true;
        }

        lib.notifyCustomer({ customerId: 1 });
        expect(mailSent).toBe(true);
    });


// mocking function with jest
    it('should send an email 2', () => {
        // const mockFunction = jest.fn();
        // mockFunction.mockReturnValue(1);
        // mockFunction.mockResolvedValue(1);
        // mockFunction.mockRejectedValue(new Error('...'));
        // const result = await mockFunction();

        db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' });
        mail.send = jest.fn();

        lib.notifyCustomer({ customerId: 1 });
        expect(mail.send).toHaveBeenCalled();
        expect(mail.send.mock.calls[0][0]).toBe('a');
        expect(mail.send.mock.calls[0][1]).toMatch(/order/);
    });

})
