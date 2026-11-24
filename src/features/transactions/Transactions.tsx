import { Plus } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Link } from "react-router";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import SegmentedControl from "../../components/ui/SegmentedControl";
import Select from "../../components/ui/Select";
import { toCents } from "../../lib/money";
import type { CategoryType, Transaction } from "../../types";
import {
  fetchAccounts,
  selectAccountsStatus,
  selectAllAccounts,
} from "../accounts/accountsSlice";
import {
  fetchCategories,
  selectAllCategories,
  selectCategoriesStatus,
} from "../categories/categoriesSlice";
import { toastShown } from "../ui/uiSlice";
import AccountStrip from "./AccountStrip";
import EditTransactionDialog from "./EditTransactionDialog";
import MonthSummary from "./MonthSummary";
import { summarizeByCurrency } from "./summary";
import TransactionFields from "./TransactionFields";
import TransactionRow from "./TransactionRow";
import {
  createTransaction,
  deleteTransaction,
  fetchTransactions,
  selectAllTransactions,
  selectTransactionsError,
  selectTransactionsStatus,
} from "./transactionsSlice";
import {
  currentMonthValue,
  filterTransactions,
  getMonthOptions,
  getMonthRange,
  groupByDay,
  parseMonthValue,
  todayInputValue,
  type TransactionFilters,
} from "./transactionUtils";

const MAX_AMOUNT_CENTS = 2_000_000_000;

const TYPE_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
] satisfies { value: TransactionFilters["type"]; label: string }[];

const Transactions = () => {
  const dispatch = useAppDispatch();
  const amountInputRef = useRef<HTMLInputElement>(null);

  const accounts = useAppSelector(selectAllAccounts);
  const accountsStatus = useAppSelector(selectAccountsStatus);
  const categories = useAppSelector(selectAllCategories);
  const categoriesStatus = useAppSelector(selectCategoriesStatus);
  const transactions = useAppSelector(selectAllTransactions);
  const status = useAppSelector(selectTransactionsStatus);
  const error = useAppSelector(selectTransactionsError);

  const [type, setType] = useState<CategoryType>("expense");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(() => todayInputValue());
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filters, setFilters] = useState<TransactionFilters>(() => ({
    month: currentMonthValue(),
    accountId: "",
    categoryId: "",
    type: "all",
  }));

  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const typeCategories = categories.filter((c) => c.type === type);
  const selectedAccountId = accounts.some((a) => a.id === accountId)
    ? accountId
    : (accounts[0]?.id ?? "");
  const selectedCategoryId = typeCategories.some((c) => c.id === categoryId)
    ? categoryId
    : (typeCategories[0]?.id ?? "");

  const needsSetup =
    accountsStatus === "succeeded" &&
    categoriesStatus === "succeeded" &&
    (accounts.length === 0 || categories.length === 0);

  const loadMonth = useCallback(
    (month: string) => {
      const parsed = parseMonthValue(month);
      void dispatch(
        fetchTransactions(getMonthRange(parsed.year, parsed.month)),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    if (accountsStatus === "idle") void dispatch(fetchAccounts());
  }, [accountsStatus, dispatch]);

  useEffect(() => {
    if (categoriesStatus === "idle") void dispatch(fetchCategories());
  }, [categoriesStatus, dispatch]);

  useEffect(() => {
    loadMonth(filters.month);
  }, [filters.month, loadMonth]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const cents = toCents(amount);

    if (!(cents > 0)) {
      setAmountError("Enter an amount greater than zero.");
      return;
    }

    if (cents > MAX_AMOUNT_CENTS) {
      setAmountError("This amount is too large.");
      return;
    }

    if (!selectedAccountId || !selectedCategoryId) return;

    setIsSubmitting(true);
    try {
      const created = await dispatch(
        createTransaction({
          accountId: selectedAccountId,
          categoryId: selectedCategoryId,
          amount: cents,
          date,
          note: note.trim(),
        }),
      ).unwrap();

      dispatch(toastShown("Transaction added", "success"));
      setAmount("");
      setNote("");
      setAmountError(null);

      const month = created.date.slice(0, 7);
      setFilters((prev) => (prev.month === month ? prev : { ...prev, month }));

      if (!window.matchMedia("(pointer: coarse)").matches) {
        amountInputRef.current?.focus();
      }
    } catch {
      dispatch(
        toastShown("Couldn't add the transaction. Please try again.", "error"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setAmountError(null);
  };

  const visibleTransactions = filterTransactions(
    transactions,
    categories,
    filters,
  );
  const groups = groupByDay(visibleTransactions, todayInputValue());
  const accountById = new Map(accounts.map((a) => [a.id, a]));
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const monthOptions = getMonthOptions();
  if (!monthOptions.some((o) => o.value === filters.month)) {
    monthOptions.push({ value: filters.month, label: filters.month });
  }

  const content = () => {
    if (status === "idle" || status === "loading") {
      return (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg bg-surface-elevated"
            />
          ))}
        </>
      );
    } else if (status === "failed") {
      return (
        <div className="flex flex-col items-start gap-3">
          <span className="text-sm text-expense">
            {error ?? "Failed to load transactions"}
          </span>

          <Button variant="secondary" onClick={() => loadMonth(filters.month)}>
            Retry
          </Button>
        </div>
      );
    } else if (groups.length === 0) {
      return (
        <div className="text-sm text-muted">
          No transactions match these filters.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <section key={group.day}>
            <h3 className="py-1 text-xs font-medium text-muted">
              {group.label}
            </h3>
            <ul className="divide-y divide-border">
              {group.items.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  category={categoryById.get(transaction.categoryId)}
                  account={accountById.get(transaction.accountId)}
                  onEdit={() => setTransactionToEdit(transaction)}
                  onDelete={() => setTransactionToDelete(transaction)}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  };

  const summaries = summarizeByCurrency(
    filterTransactions(transactions, categories, {
      ...filters,
      categoryId: "",
      type: "all",
    }),
    categories,
    accounts,
  );
  const monthLabel =
    monthOptions.find((o) => o.value === filters.month)?.label ?? filters.month;

  return (
    <div className="flex flex-col gap-5">
      {accounts.length > 0 && (
        <section className="flex flex-col gap-3">
          <AccountStrip
            accounts={accounts}
            selectedId={filters.accountId}
            onSelect={(accountId) =>
              setFilters((prev) => ({ ...prev, accountId }))
            }
          />
          {status === "succeeded" && (
            <MonthSummary monthLabel={monthLabel} summaries={summaries} />
          )}
        </section>
      )}

      <div className="flex flex-col items-start gap-5 xl:flex-row">
        <Card header="Add Transaction" className="w-full xl:w-auto xl:min-w-95">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {needsSetup && (
              <p className="text-sm text-muted">
                Add an{" "}
                <Link to="/accounts" className="text-primary hover:underline">
                  account
                </Link>{" "}
                and a{" "}
                <Link to="/categories" className="text-primary hover:underline">
                  category
                </Link>{" "}
                first.
              </p>
            )}

            <TransactionFields
              type={type}
              setType={setType}
              amount={amount}
              setAmount={handleAmountChange}
              amountError={amountError}
              accountId={selectedAccountId}
              setAccountId={setAccountId}
              categoryId={selectedCategoryId}
              setCategoryId={setCategoryId}
              date={date}
              setDate={setDate}
              note={note}
              setNote={setNote}
              accounts={accounts}
              categories={categories}
              amountInputRef={amountInputRef}
            />

            <Button
              type="submit"
              className="w-full"
              loading={isSubmitting}
              disabled={needsSetup}
            >
              <Plus size={16} />
              Add Transaction
            </Button>
          </form>
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between">
              <span>Transactions</span>

              {status === "succeeded" && (
                <span className="text-sm font-normal text-muted">
                  {visibleTransactions.length}{" "}
                  {visibleTransactions.length === 1
                    ? "transaction"
                    : "transactions"}
                </span>
              )}
            </div>
          }
          className="w-full xl:min-w-0 xl:flex-1"
        >
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-36">
              <Select
                aria-label="Month"
                value={filters.month}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, month: e.target.value }))
                }
              >
                {monthOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-44">
              <Select
                aria-label="Filter by account"
                value={filters.accountId}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, accountId: e.target.value }))
                }
              >
                <option value="">All accounts</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-44">
              <Select
                aria-label="Filter by category"
                value={filters.categoryId}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                  }))
                }
              >
                <option value="">All categories</option>
                <optgroup label="Expense">
                  {categories
                    .filter((c) => c.type === "expense")
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Income">
                  {categories
                    .filter((c) => c.type === "income")
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </optgroup>
              </Select>
            </div>
          </div>

          <SegmentedControl
            label="Filter by type"
            options={TYPE_FILTER_OPTIONS}
            value={filters.type}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, type: value }))
            }
          />

          {content()}
        </Card>

        {transactionToDelete && (
          <ConfirmDialog
            onClose={() => setTransactionToDelete(null)}
            onConfirm={async () => {
              setIsDeleting(true);
              try {
                await dispatch(
                  deleteTransaction(transactionToDelete.id),
                ).unwrap();
                dispatch(toastShown("Transaction deleted", "success"));
              } catch {
                dispatch(toastShown("Failed to delete transaction", "error"));
              } finally {
                setIsDeleting(false);
                setTransactionToDelete(null);
              }
            }}
            title="Delete this transaction?"
            description="This will permanently delete the transaction and update the account balance. This action cannot be undone."
            confirmLabel="Delete Transaction"
            loading={isDeleting}
          />
        )}

        {transactionToEdit && (
          <EditTransactionDialog
            transaction={transactionToEdit}
            onClose={() => setTransactionToEdit(null)}
            onUpdated={(month) =>
              setFilters((prev) =>
                prev.month === month ? prev : { ...prev, month },
              )
            }
          />
        )}
      </div>
    </div>
  );
};

export default Transactions;
