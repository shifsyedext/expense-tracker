import {
  Button,
  Card,
  DatePicker,
  Input,
  InputNumber,
  Select,
  Typography,
} from 'antd';
import {
  Formik,
  Form as FormikForm,
  type FormikHelpers,
} from 'formik';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import type {
  CreateExpenseRequest,
  ExpenseCategory,
} from '../../types/expense';
import './ExpenseForm.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ExpenseFormProps {
  readonly initialValues?: CreateExpenseRequest;
  readonly submitLabel?: string;
  readonly onSubmit: (
    values: CreateExpenseRequest,
  ) => Promise<void>;
}

const categories: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Other',
];

const validationSchema =
  Yup.object({
    title: Yup.string()
      .trim()
      .required('Title is required.'),

    amount: Yup.number()
      .typeError('Amount must be a number.')
      .positive('Amount must be greater than zero.')
      .required('Amount is required.'),

    category: Yup.string()
      .oneOf(categories)
      .required('Category is required.'),

    date: Yup.string()
      .required('Date is required.'),

    notes: Yup.string()
      .max(
        500,
        'Notes cannot exceed 500 characters.',
      ),
  });

const ExpenseForm = ({
  initialValues,
  submitLabel = 'Add Expense',
  onSubmit,
}: ExpenseFormProps): React.JSX.Element => {
    const defaultValues: CreateExpenseRequest = {
    title: '',
    amount: 0,
    category: 'Food',
    date: dayjs().format('YYYY-MM-DD'),
    notes: '',
    };

  const handleSubmit = async (
    values: CreateExpenseRequest,
    helpers: FormikHelpers<CreateExpenseRequest>,
  ): Promise<void> => {
    try {
      await onSubmit(values);
      helpers.resetForm();
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <Card className="expense-form">
      <Title level={3}>
        Add Expense
      </Title>

      <Formik
        initialValues={initialValues ?? defaultValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          setFieldValue,
          handleChange,
          handleBlur,
        }) => (
          <FormikForm
            className="expense-form__fields"
            noValidate
          >
            <div className="expense-form__field">
              <label
                htmlFor="expense-title"
                className="expense-form__label"
              >
                Title
              </label>

              <Input
                id="expense-title"
                name="title"
                size="large"
                placeholder="e.g. Grocery shopping"
                value={values.title}
                status={
                  touched.title && errors.title
                    ? 'error'
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {touched.title && errors.title && (
                <Text type="danger">
                  {errors.title}
                </Text>
              )}
            </div>

            <div className="expense-form__field">
              <label
                htmlFor="expense-amount"
                className="expense-form__label"
              >
                Amount
              </label>

              <InputNumber
                id="expense-amount"
                name="amount"
                size="large"
                min={0}
                precision={2}
                style={{ width: '100%' }}
                placeholder="0.00"
                value={values.amount}
                status={
                  touched.amount && errors.amount
                    ? 'error'
                    : undefined
                }
                onChange={(value) => {
                  setFieldValue(
                    'amount',
                    value ?? 0,
                  );
                }}
                onBlur={handleBlur}
              />

              {touched.amount &&
                errors.amount && (
                  <Text type="danger">
                    {errors.amount}
                  </Text>
                )}
            </div>

            <div className="expense-form__field">
              <label
                htmlFor="expense-category"
                className="expense-form__label"
              >
                Category
              </label>

              <Select
                id="expense-category"
                size="large"
                style={{ width: '100%' }}
                value={values.category}
                options={categories.map(
                  (category) => ({
                    label: category,
                    value: category,
                  }),
                )}
                onChange={(value) => {
                  setFieldValue(
                    'category',
                    value,
                  );
                }}
              />

              {touched.category &&
                errors.category && (
                  <Text type="danger">
                    {errors.category}
                  </Text>
                )}
            </div>

            <div className="expense-form__field">
              <label
                htmlFor="expense-date"
                className="expense-form__label"
              >
                Date
              </label>

              <DatePicker
                id="expense-date"
                size="large"
                style={{ width: '100%' }}
                value={
                  values.date
                    ? dayjs(values.date)
                    : null
                }
                onChange={(date) => {
                  setFieldValue(
                    'date',
                    date
                      ? date.format(
                          'YYYY-MM-DD',
                        )
                      : '',
                  );
                }}
              />

              {touched.date &&
                errors.date && (
                  <Text type="danger">
                    {errors.date}
                  </Text>
                )}
            </div>

            <div className="expense-form__field">
              <label
                htmlFor="expense-notes"
                className="expense-form__label"
              >
                Notes
              </label>

              <TextArea
                id="expense-notes"
                name="notes"
                rows={4}
                maxLength={500}
                showCount
                placeholder="Optional notes"
                value={values.notes}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isSubmitting}
            >
              {submitLabel}
            </Button>
          </FormikForm>
        )}
      </Formik>
    </Card>
  );
};

export default ExpenseForm;