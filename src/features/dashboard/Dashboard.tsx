import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Page from "../../components/layout/Page";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import SegmentedControl from "../../components/ui/SegmentedControl";
import Select from "../../components/ui/Select";
import { formatMoney } from "../../lib/money";
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
import {
  currentMonthValue,
  getMonthOptions,
} from "../transactions/transactionUtils";
import {
  fetchOverview,
  selectDashboardError,
  selectDashboardStatus,
  selectOverview,
} from "./dashboardSlice";
import { categoryShares, percentChange } from "./dashboardUtils";
import IncomeExpenseChart from "./IncomeExpenseChart";
import RecentTransactions from "./RecentTransactions";
import SpendingByCategory from "./SpendingByCategory";
import StatCard from "./StatCard";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectAllAccounts);
  const accountsStatus = useAppSelector(selectAccountsStatus);
  const categories = useAppSelector(selectAllCategories);
  const categoriesStatus = useAppSelector(selectCategoriesStatus);
  const overview = useAppSelector(selectOverview);
  const status = useAppSelector(selectDashboardStatus);
  const error = useAppSelector(selectDashboardError);

  const [month, setMonth] = useState(currentMonthValue());
  const [chosenCurrency, setChosenCurrency] = useState("");

  const currencies = [...new Set(accounts.map((a) => a.currency))].sort();
  const currency = currencies.includes(chosenCurrency)
    ? chosenCurrency
    : (currencies[0] ?? "");

  useEffect(() => {
    if (accountsStatus === "idle") void dispatch(fetchAccounts());
  }, [accountsStatus, dispatch]);

  useEffect(() => {
    if (categoriesStatus === "idle") void dispatch(fetchCategories());
  }, [categoriesStatus, dispatch]);

  useEffect(() => {
    if (currency) void dispatch(fetchOverview({ month, currency }));
  }, [month, currency, dispatch]);

  const monthOptions = getMonthOptions();
  const monthLabel =
    monthOptions.find((o) => o.value === month)?.label ?? month;

  const actions = (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="w-36">
        <Select
          aria-label="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {monthOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {currencies.length > 1 && (
        <SegmentedControl
          label="Currency"
          options={currencies.map((c) => ({ value: c, label: c }))}
          value={currency}
          onChange={setChosenCurrency}
        />
      )}

      <Link
        to="/transactions"
        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-background transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Plus size={16} />
        Add Transaction
      </Link>
    </div>
  );

  const skeleton = (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-surface-elevated"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-surface-elevated" />
    </div>
  );

  const retry = (message: string, onRetry: () => void) => (
    <Card>
      <div className="flex flex-col items-start gap-3">
        <span className="text-sm text-expense">{message}</span>
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </Card>
  );

  const content = () => {
    if (accountsStatus === "failed") {
      return retry(
        "Couldn't load your accounts.",
        () => void dispatch(fetchAccounts()),
      );
    }

    if (
      accountsStatus === "idle" ||
      accountsStatus === "loading" ||
      categoriesStatus === "idle" ||
      categoriesStatus === "loading"
    ) {
      return skeleton;
    }

    if (accounts.length === 0) {
      return (
        <Card>
          <div className="flex flex-col items-start gap-3">
            <span className="text-sm text-muted">
              Add an account and a few transactions to see your dashboard.
            </span>
            <Link
              to="/accounts"
              className="text-sm text-primary hover:underline"
            >
              Go to Accounts →
            </Link>
          </div>
        </Card>
      );
    }

    const isCurrent =
      overview?.month === month && overview.currency === currency;

    if (!overview || !isCurrent) {
      return status === "failed"
        ? retry(
            error ?? "Couldn't load the dashboard.",
            () => void dispatch(fetchOverview({ month, currency })),
          )
        : skeleton;
    }

    const hasMonthlyData = overview.monthly.some(
      (m) => m.income > 0 || m.expense > 0,
    );

    return (
      <div className="flex flex-col gap-5">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label={`Total balance · ${currency}`}
            value={formatMoney(overview.balance, currency)}
            change={percentChange(overview.balance, overview.previousBalance)}
            goodWhen="up"
            highlighted
          />
          <StatCard
            label={`Income · ${monthLabel}`}
            value={formatMoney(overview.income, currency)}
            change={percentChange(overview.income, overview.previousIncome)}
            goodWhen="up"
          />
          <StatCard
            label={`Spent · ${monthLabel}`}
            value={formatMoney(
              overview.expense === 0 ? 0 : -overview.expense,
              currency,
            )}
            valueClassName={overview.expense > 0 ? "text-expense" : undefined}
            change={percentChange(overview.expense, overview.previousExpense)}
            goodWhen="down"
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <SpendingByCategory
            shares={categoryShares(overview.byCategory, categories)}
            currency={currency}
            monthLabel={monthLabel}
          />
          <RecentTransactions
            transactions={overview.recent}
            categories={categories}
            accounts={accounts}
            currency={currency}
          />
        </div>

        <Card
          header={
            <div className="flex items-center justify-between gap-2">
              <span>Income vs Expenses</span>
              <span className="text-sm font-normal text-muted">
                Last 6 months
              </span>
            </div>
          }
        >
          {hasMonthlyData ? (
            <IncomeExpenseChart
              monthly={overview.monthly}
              categories={categories}
              currency={currency}
            />
          ) : (
            <div className="text-sm text-muted">
              No transactions in the last 6 months.
            </div>
          )}
        </Card>
      </div>
    );
  };

  return (
    <Page title="Dashboard" actions={actions}>
      {content()}
    </Page>
  );
};

export default Dashboard;
