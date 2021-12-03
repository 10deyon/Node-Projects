However, I believe that embracing interdependence, proactivity and teachability will help in your journey.

# PACKAGES
### FAWN FOR TRANSACTIONS LIKE DB:TRANSACTIONS
### TEST FRAMEWORKS: jasmine (earlier), mocha (most popular with plugins like chai and sinon), jest (newest used by facebook)
    **jest is recommended to use and you can install it like so: npm i jest --save-dev because it's a development installation and not used on production**
    **always check for documentation**


add --verbose flag to the test script in package.json to display more information on your console during test

npm i supertest --save-dev
this is for integration testing, and create another db(local) for testing



async() = {
    const course = await Course.findById(courseId);
    course.author.name = "New Value",
    course.save();

    await Course.update({_id: courseId}, {
        $set: {
            subModel.fieldName: "New Value"
        }

        $unset: {
            subModel.fieldName
        }
    });
}
